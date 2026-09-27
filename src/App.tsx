import React, { useState, useEffect } from 'react';
import { TabType, ScreenView, WorkoutExercise, SetEntry, RoutineTemplate, MealCategory, FoodItem, ExerciseDefinition } from './types';
import {
  INITIAL_ROUTINES,
  INITIAL_ACTIVE_EXERCISES,
  INITIAL_MEALS,
  INITIAL_LOGGED_WORKOUTS,
  ALL_EXERCISE_DEFINITIONS,
  HistoryWorkoutItem,
} from './data/mockData';
import { useAuth } from './hooks/useAuth';
import {
  saveWorkoutToFirestore,
  deleteWorkoutFromFirestore,
  fetchUserWorkouts,
  saveRoutineToFirestore,
  fetchUserRoutines,
  saveMealsToFirestore,
  fetchUserMeals,
} from './lib/firestoreService';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LogScreen } from './components/screens/LogScreen';
import { ActiveWorkoutScreen } from './components/screens/ActiveWorkoutScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { FoodScreen } from './components/screens/FoodScreen';
import { ExercisesLibraryScreen } from './components/screens/ExercisesLibraryScreen';
import { ExerciseDetailScreen } from './components/screens/ExerciseDetailScreen';
import { BarcodeScannerScreen } from './components/screens/BarcodeScannerScreen';
import { LicensesScreen } from './components/screens/LicensesScreen';
import { PlateCalculatorModal } from './components/modals/PlateCalculatorModal';
import { ProfileModal } from './components/modals/ProfileModal';

export default function App() {
  const { user, loading: authLoading, error: authError, signInWithGoogle, signOut } = useAuth();

  const [currentTab, setCurrentTab] = useState<TabType>('log');
  const [screenView, setScreenView] = useState<ScreenView>({ type: 'main' });

  // Workout state
  const [routines, setRoutines] = useState<RoutineTemplate[]>(INITIAL_ROUTINES);
  const [activeExercises, setActiveExercises] = useState<WorkoutExercise[]>(INITIAL_ACTIVE_EXERCISES);
  const [activeWorkoutRunning, setActiveWorkoutRunning] = useState<boolean>(true);
  const [elapsedWorkoutSeconds, setElapsedWorkoutSeconds] = useState<number>(2520); // 42m

  // History state
  const [loggedWorkouts, setLoggedWorkouts] = useState<HistoryWorkoutItem[]>(INITIAL_LOGGED_WORKOUTS);

  // Food state
  const [meals, setMeals] = useState<MealCategory[]>(INITIAL_MEALS);

  // Plate Calculator Modal state
  const [plateCalcState, setPlateCalcState] = useState<{ isOpen: boolean; weight: number }>({
    isOpen: false,
    weight: 100,
  });

  // Profile Modal state
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync with Firestore when user signs in
  useEffect(() => {
    if (!user) return;

    // Load user's persisted workouts
    fetchUserWorkouts(user.uid).then((remoteWorkouts) => {
      if (remoteWorkouts && remoteWorkouts.length > 0) {
        setLoggedWorkouts(remoteWorkouts);
      }
    });

    // Load user's persisted routines
    fetchUserRoutines(user.uid).then((remoteRoutines) => {
      if (remoteRoutines && remoteRoutines.length > 0) {
        setRoutines(remoteRoutines);
      }
    });

    // Load user's persisted meals
    fetchUserMeals(user.uid).then((remoteMeals) => {
      if (remoteMeals && remoteMeals.length > 0) {
        setMeals(remoteMeals);
      }
    });
  }, [user]);

  // Daily Totals calculation for Dashboard
  const dailyKcal = meals.reduce(
    (sum, m) => sum + m.items.reduce((iSum, i) => iSum + i.kcal, 0),
    0
  );

  // Today's total volume from active workout + logged workouts
  const activeWorkoutVolume = activeExercises.reduce((acc, ex) => {
    return (
      acc +
      ex.sets.reduce((setAcc, set) => {
        if (set.completed && set.weightKg > 0 && set.reps > 0) {
          return setAcc + set.weightKg * set.reps;
        }
        return setAcc;
      }, 0)
    );
  }, 0);

  const todayLoggedVolume = loggedWorkouts
    .filter((w) => w.dateTag.toLowerCase().includes('today') || w.dateTag.toLowerCase().includes('sep 24'))
    .reduce((sum, w) => sum + w.volumeKg, 0);

  const totalDailyVolume = activeWorkoutRunning
    ? Math.max(activeWorkoutVolume, todayLoggedVolume)
    : todayLoggedVolume || 12480;

  // Helper function to round weight to standard 2.5kg increments
  const roundToGymIncrement = (val: number, minVal: number = 20): number => {
    const rounded = Math.round(val / 2.5) * 2.5;
    return Math.max(minVal, rounded);
  };

  // Generate standard progressive warmup routine (bar, 40%, 60%, 80%) based on target working set weight
  const generateWarmupAndWorkingSets = (
    workingWeight: number,
    workingRepsStr: string,
    numWorkingSets: number,
    equipment: string,
    baseId: string
  ): SetEntry[] => {
    const targetReps = parseInt(workingRepsStr) || 8;
    const sets: SetEntry[] = [];
    const isBarbell = equipment.toLowerCase().includes('barbell');
    const barWeight = isBarbell ? 20 : Math.max(5, Math.round(workingWeight * 0.25));

    // If working weight is heavy enough to warrant progressive warmups
    if (workingWeight >= 40) {
      // Warmup 1: Empty Olympic bar or baseline mobility (approx 10 reps)
      sets.push({
        id: `${baseId}-w1`,
        type: 'warmup',
        weightKg: barWeight,
        reps: 10,
        rpe: 6,
        completed: false,
      });

      // Warmup 2: ~40% of target weight (approx 6-8 reps)
      const w40 = roundToGymIncrement(workingWeight * 0.4, barWeight);
      if (w40 > barWeight && w40 < workingWeight * 0.8) {
        sets.push({
          id: `${baseId}-w2`,
          type: 'warmup',
          weightKg: w40,
          reps: 6,
          rpe: 6.5,
          completed: false,
        });
      }

      // Warmup 3: ~60% of target weight (approx 4-5 reps)
      const w60 = roundToGymIncrement(workingWeight * 0.6, barWeight);
      if (w60 > (sets[sets.length - 1]?.weightKg || barWeight) && w60 < workingWeight * 0.85) {
        sets.push({
          id: `${baseId}-w3`,
          type: 'warmup',
          weightKg: w60,
          reps: 4,
          rpe: 7,
          completed: false,
        });
      }

      // Warmup 4: ~80% potentiation single/double if heavy (>= 80kg)
      if (workingWeight >= 80) {
        const w80 = roundToGymIncrement(workingWeight * 0.8, barWeight);
        if (w80 > (sets[sets.length - 1]?.weightKg || barWeight) && w80 < workingWeight) {
          sets.push({
            id: `${baseId}-w4`,
            type: 'warmup',
            weightKg: w80,
            reps: 2,
            rpe: 7.5,
            completed: false,
          });
        }
      }
    } else if (workingWeight > barWeight) {
      // Light exercise warmup: single bar/light warmup set
      sets.push({
        id: `${baseId}-w1`,
        type: 'warmup',
        weightKg: barWeight,
        reps: 8,
        rpe: 6.5,
        completed: false,
      });
    }

    // Working sets
    for (let i = 0; i < numWorkingSets; i++) {
      sets.push({
        id: `${baseId}-work-${i + 1}`,
        type: 'work',
        weightKg: workingWeight,
        reps: targetReps,
        rpe: i === numWorkingSets - 1 ? 8.5 : 8.0,
        completed: false,
      });
    }

    return sets;
  };

  // Handlers for starting workout
  const handleStartWorkout = (routine?: RoutineTemplate) => {
    if (routine) {
      const mappedExercises: WorkoutExercise[] = routine.exercises.map((re, idx) => {
        const baseId = `s-${Date.now()}-${idx}`;
        const sets = generateWarmupAndWorkingSets(
          re.weight,
          re.reps,
          re.sets,
          re.equipment,
          baseId
        );

        return {
          id: `we-${Date.now()}-${idx}`,
          exerciseId: re.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: re.name,
          muscles: re.muscles,
          equipment: re.equipment,
          target: `${re.weight} kg × ${re.reps} reps`,
          est1RM: Math.round(re.weight * 1.2),
          restTimeSeconds: 90,
          sets,
        };
      });
      setActiveExercises(mappedExercises);
    }
    setActiveWorkoutRunning(true);
    setScreenView({ type: 'active-workout' });
  };

  const handleFinishWorkout = (totalVolume: number, elapsedSecs: number) => {
    const mins = Math.floor(elapsedSecs / 60);
    const completedSetsCount = activeExercises.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
      0
    );

    const newWorkout: HistoryWorkoutItem = {
      id: `logged-${Date.now()}`,
      title: 'Current Workout Session',
      dateTag: 'Today',
      timeRange: `${mins} mins`,
      volumeKg: totalVolume,
      setsCount: completedSetsCount || 16,
      exercisesCount: activeExercises.length,
      chips: activeExercises.map((e) => `${e.name.split(' ')[0].toUpperCase()} ${e.sets.length} SETS`),
    };

    setLoggedWorkouts([newWorkout, ...loggedWorkouts]);

    // Persist to Firestore if user logged in
    if (user) {
      saveWorkoutToFirestore(user.uid, newWorkout);
    }

    setActiveWorkoutRunning(false);
    setScreenView({ type: 'main' });
    setCurrentTab('history');
  };

  // Food handlers
  const handleAddFoodItem = (mealName: string, item: FoodItem) => {
    setMeals((prev) => {
      const updated = prev.map((m) => {
        if (m.name.toLowerCase() !== mealName.toLowerCase()) return m;
        return {
          ...m,
          items: [item, ...m.items],
        };
      });
      if (user) {
        saveMealsToFirestore(user.uid, updated);
      }
      return updated;
    });
  };

  const handleDeleteFoodItem = (mealId: string, itemId: string) => {
    setMeals((prev) => {
      const updated = prev.map((m) => {
        if (m.id !== mealId) return m;
        return {
          ...m,
          items: m.items.filter((i) => i.id !== itemId),
        };
      });
      if (user) {
        saveMealsToFirestore(user.uid, updated);
      }
      return updated;
    });
  };

  const handleUseScannedFood = (item: FoodItem) => {
    const target =
      screenView.type === 'barcode-scanner' && screenView.targetMeal
        ? screenView.targetMeal
        : 'Lunch';
    handleAddFoodItem(target, item);
    setScreenView({ type: 'main' });
    setCurrentTab('food');
  };

  // Add exercise to active session from detail or library
  const handleAddExerciseToActive = (exDef: ExerciseDefinition) => {
    const newEx: WorkoutExercise = {
      id: `ex-${Date.now()}`,
      exerciseId: exDef.id,
      name: exDef.name,
      muscles: exDef.tags.join(' · '),
      equipment: exDef.tags.includes('Barbell') ? 'Barbell' : 'Dumbbells',
      est1RM: exDef.bestEst1RM,
      restTimeSeconds: 120,
      sets: [
        { id: `s-${Date.now()}-1`, type: 'work', weightKg: 60, reps: 8, rpe: 7.5, completed: false },
        { id: `s-${Date.now()}-2`, type: 'work', weightKg: 60, reps: 8, rpe: 8, completed: false },
        { id: `s-${Date.now()}-3`, type: 'work', weightKg: 60, reps: 8, rpe: null, completed: false },
      ],
    };

    setActiveExercises((prev) => [...prev, newEx]);
    setActiveWorkoutRunning(true);
    setScreenView({ type: 'active-workout' });
  };

  // Navigation handlers
  const handleBack = () => {
    if (screenView.type === 'active-workout') {
      // Minimize active workout to main tab, preserving live session
      setScreenView({ type: 'main' });
      return;
    }
    setScreenView({ type: 'main' });
  };

  return (
    <div className="min-h-screen bg-[#131315] text-[#e5e1e4] flex flex-col font-sans selection:bg-[#34d399] selection:text-[#003825]">
      {/* Header */}
      <Header
        currentTab={currentTab}
        screenView={screenView}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setScreenView({ type: 'main' });
        }}
        onNavigateScreen={setScreenView}
        onBack={handleBack}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenPlateCalc={() => setPlateCalcState({ isOpen: true, weight: 100 })}
        activeWorkoutRunning={activeWorkoutRunning && screenView.type !== 'active-workout'}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 flex flex-col relative w-full">
        {screenView.type === 'active-workout' ? (
          <ActiveWorkoutScreen
            exercises={activeExercises}
            onUpdateExercises={setActiveExercises}
            onFinishSession={handleFinishWorkout}
            onOpenPlateCalc={(weight) => setPlateCalcState({ isOpen: true, weight })}
            onInspectExercise={(exerciseId) =>
              setScreenView({ type: 'exercise-detail', exerciseId })
            }
            onAddExercise={() => {
              setCurrentTab('exercises');
              setScreenView({ type: 'main' });
            }}
            soundEnabled={soundEnabled}
          />
        ) : screenView.type === 'barcode-scanner' ? (
          <BarcodeScannerScreen
            onBack={() => setScreenView({ type: 'main' })}
            onUseFood={handleUseScannedFood}
            targetMealName={screenView.targetMeal || 'Lunch'}
          />
        ) : screenView.type === 'exercise-detail' ? (
          (() => {
            const exDef =
              ALL_EXERCISE_DEFINITIONS.find((e) => e.id === screenView.exerciseId) ||
              ALL_EXERCISE_DEFINITIONS[0];
            return (
              <ExerciseDetailScreen
                exercise={exDef}
                onBack={() => setScreenView({ type: 'main' })}
                onAddToSession={handleAddExerciseToActive}
              />
            );
          })()
        ) : screenView.type === 'licenses' ? (
          <LicensesScreen onBack={() => setScreenView({ type: 'main' })} />
        ) : (
          // Main 4-Tab Views
          <>
            {currentTab === 'log' && (
              <LogScreen
                routines={routines}
                onStartWorkout={handleStartWorkout}
                onOpenPlateCalc={() => setPlateCalcState({ isOpen: true, weight: 100 })}
                onAddNewRoutine={(newRoutine) => {
                  setRoutines([newRoutine, ...routines]);
                  if (user) {
                    saveRoutineToFirestore(user.uid, newRoutine);
                  }
                }}
                dailyKcal={dailyKcal}
                dailyVolumeKg={totalDailyVolume}
                activeWorkoutRunning={activeWorkoutRunning}
                onOpenFoodTab={() => setCurrentTab('food')}
                onOpenHistoryTab={() => setCurrentTab('history')}
              />
            )}

            {currentTab === 'history' && (
              <HistoryScreen
                loggedWorkouts={loggedWorkouts}
                onDeleteWorkout={(id) => {
                  setLoggedWorkouts(loggedWorkouts.filter((w) => w.id !== id));
                  if (user) {
                    deleteWorkoutFromFirestore(user.uid, id);
                  }
                }}
                onSelectExerciseDetail={(exerciseId) =>
                  setScreenView({ type: 'exercise-detail', exerciseId })
                }
              />
            )}

            {currentTab === 'food' && (
              <FoodScreen
                meals={meals}
                onAddFoodItem={handleAddFoodItem}
                onDeleteFoodItem={handleDeleteFoodItem}
                onOpenScanner={(mealName) =>
                  setScreenView({ type: 'barcode-scanner', targetMeal: mealName })
                }
              />
            )}

            {currentTab === 'exercises' && (
              <ExercisesLibraryScreen
                onSelectExercise={(exerciseId) =>
                  setScreenView({ type: 'exercise-detail', exerciseId })
                }
                onAddExerciseToActive={handleAddExerciseToActive}
                activeWorkoutRunning={activeWorkoutRunning}
              />
            )}
          </>
        )}
      </main>

      {/* Persistent Bottom Tab Navigation (hidden in fullscreen scanner & detail views if active) */}
      {screenView.type === 'main' && (
        <Navigation
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setScreenView({ type: 'main' });
          }}
          activeWorkoutRunning={activeWorkoutRunning}
          onOpenActiveWorkout={() => setScreenView({ type: 'active-workout' })}
          elapsedSeconds={elapsedWorkoutSeconds}
        />
      )}

      {/* Global Plate Calculator Modal */}
      <PlateCalculatorModal
        isOpen={plateCalcState.isOpen}
        onClose={() => setPlateCalcState((prev) => ({ ...prev, isOpen: false }))}
        initialWeight={plateCalcState.weight}
        onApplyWeight={(appliedWeight) => {
          // If an active workout is open, update first incomplete set of current barbell exercise
          if (activeExercises.length > 0) {
            setActiveExercises((prev) =>
              prev.map((ex, i) => {
                if (i !== 0) return ex;
                return {
                  ...ex,
                  sets: ex.sets.map((s, sI) => (sI === 0 ? { ...s, weightKg: appliedWeight } : s)),
                };
              })
            );
          }
        }}
      />

      {/* Global Profile & Settings Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onOpenLicenses={() => {
          setProfileModalOpen(false);
          setScreenView({ type: 'licenses' });
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        user={user}
        onSignIn={signInWithGoogle}
        onSignOut={signOut}
        authLoading={authLoading}
        authError={authError}
      />
    </div>
  );
}

