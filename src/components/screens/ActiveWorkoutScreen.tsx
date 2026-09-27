import React, { useState, useEffect } from 'react';
import { WorkoutExercise, SetEntry, ExerciseDefinition } from '../../types';
import { KeypadBottomSheet } from '../modals/KeypadBottomSheet';

interface ActiveWorkoutScreenProps {
  exercises: WorkoutExercise[];
  onUpdateExercises: (exercises: WorkoutExercise[]) => void;
  onFinishSession: (totalVolume: number, elapsedSeconds: number) => void;
  onOpenPlateCalc: (weight: number) => void;
  onInspectExercise: (exerciseId: string) => void;
  onAddExercise: () => void;
  soundEnabled: boolean;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  exercises,
  onUpdateExercises,
  onFinishSession,
  onOpenPlateCalc,
  onInspectExercise,
  onAddExercise,
  soundEnabled,
}) => {
  // Elapsed workout timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(2520); // 42 minutes initial
  // Rest timer
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number>(85); // 1:25
  const [isRestTimerActive, setIsRestTimerActive] = useState<boolean>(true);
  const [totalRestDuration, setTotalRestDuration] = useState<number>(90);

  // Keypad Bottom Sheet state
  const [keypadState, setKeypadState] = useState<{
    isOpen: boolean;
    exerciseId: string;
    setId: string;
    field: 'weight' | 'reps' | 'rpe';
    title: string;
    unit: string;
    value: number;
  }>({
    isOpen: false,
    exerciseId: '',
    setId: '',
    field: 'weight',
    title: '',
    unit: '',
    value: 0,
  });

  // Ticking workout timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest countdown
  useEffect(() => {
    if (!isRestTimerActive || restSecondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setRestSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsRestTimerActive(false);
          // Play beep if sound enabled
          if (soundEnabled && typeof window !== 'undefined') {
            try {
              const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High chime A5
              gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.3);
            } catch {
              // Ignore audio errors
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRestTimerActive, restSecondsRemaining, soundEnabled]);

  // Compute live total volume (sum of weight * reps for all completed sets)
  const totalVolume = exercises.reduce((acc, ex) => {
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

  // Format elapsed time (e.g. "42m elapsed" or "00:42:18")
  const formatElapsed = () => {
    const mins = Math.floor(elapsedSeconds / 60);
    return `${mins}m elapsed`;
  };

  const formatRest = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleSetCompletion = (exerciseId: string, setId: string) => {
    const updated = exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s) => {
          if (s.id !== setId) return s;
          const nextCompleted = !s.completed;
          if (nextCompleted) {
            // Start rest timer automatically when completing set
            const restTime = ex.restTimeSeconds || 90;
            setTotalRestDuration(restTime);
            setRestSecondsRemaining(restTime);
            setIsRestTimerActive(true);
          }
          return { ...s, completed: nextCompleted };
        }),
      };
    });
    onUpdateExercises(updated);
  };

  const handleAddSet = (exerciseId: string) => {
    const updated = exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: SetEntry = {
        id: `s-${Date.now()}`,
        type: 'work',
        weightKg: lastSet ? lastSet.weightKg : 60,
        reps: lastSet ? lastSet.reps : 8,
        rpe: null,
        completed: false,
      };
      return { ...ex, sets: [...ex.sets, newSet] };
    });
    onUpdateExercises(updated);
  };

  const handleToggleSetType = (exerciseId: string, setId: string) => {
    const updated = exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s) => {
          if (s.id !== setId) return s;
          const nextType: 'warmup' | 'work' | 'drop' =
            s.type === 'work' ? 'warmup' : s.type === 'warmup' ? 'drop' : 'work';
          return { ...s, type: nextType };
        }),
      };
    });
    onUpdateExercises(updated);
  };

  const openKeypad = (
    exerciseId: string,
    setId: string,
    setNum: number,
    field: 'weight' | 'reps' | 'rpe',
    currentVal: number | null
  ) => {
    const fieldTitles = {
      weight: `SET ${setNum} · WEIGHT`,
      reps: `SET ${setNum} · REPS`,
      rpe: `SET ${setNum} · RPE`,
    };
    const fieldUnits = {
      weight: 'kg',
      reps: 'reps',
      rpe: 'rpe',
    };

    setKeypadState({
      isOpen: true,
      exerciseId,
      setId,
      field,
      title: fieldTitles[field],
      unit: fieldUnits[field],
      value: currentVal !== null ? currentVal : 0,
    });
  };

  const handleKeypadConfirm = (val: number) => {
    const { exerciseId, setId, field } = keypadState;
    const updated = exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s) => {
          if (s.id !== setId) return s;
          if (field === 'weight') return { ...s, weightKg: val };
          if (field === 'reps') return { ...s, reps: Math.round(val) };
          if (field === 'rpe') return { ...s, rpe: val === 0 ? null : val };
          return s;
        }),
      };
    });
    onUpdateExercises(updated);
  };

  const handleRpeChange = (exerciseId: string, setId: string, newRpe: number | null) => {
    const updated = exercises.map((ex) => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s) => {
          if (s.id !== setId) return s;
          return { ...s, rpe: newRpe };
        }),
      };
    });
    onUpdateExercises(updated);
  };

  const handleSkipRest = () => {
    setIsRestTimerActive(false);
    setRestSecondsRemaining(0);
  };

  const handleAddRest30 = () => {
    setRestSecondsRemaining((prev) => prev + 30);
    setIsRestTimerActive(true);
  };

  return (
    <div className="flex flex-col w-full pb-32 px-4 pt-16 max-w-md mx-auto">
      {/* Session Live & Volume Header Bar matching Image 1 */}
      <div className="flex items-end justify-between pt-2 pb-3">
        <div className="flex flex-col">
          <h2 className="text-[24px] font-bold text-[#e5e1e4] tracking-tight">
            Session
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#5af0b3] animate-pulse"></span>
            <span className="text-[12px] text-[#85948b] font-medium">
              Live · {formatElapsed()}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#85948b]">
            VOLUME
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-[26px] font-bold text-[#e5e1e4] tracking-tight tabular-nums">
              {totalVolume.toLocaleString()}
            </span>
            <span className="text-[14px] text-[#85948b]">kg</span>
          </div>
        </div>
      </div>

      {/* Interactive Rest Timer Card matching Image 1 */}
      {restSecondsRemaining > 0 && (
        <div className="w-full p-3.5 rounded-2xl bg-[#1b1b1d] border border-[#202024] flex items-center justify-between mb-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#201f21] border-2 border-[#34d399] flex items-center justify-center text-[#34d399]">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#85948b]">
                REST
              </span>
              <span className="text-[22px] font-bold text-[#e5e1e4] tracking-tight tabular-nums -mt-1">
                {formatRest(restSecondsRemaining)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddRest30}
              className="px-3 py-1.5 rounded-lg bg-[#2a2a2c] hover:bg-[#353437] text-[#e5e1e4] text-[12px] font-semibold active:scale-95 transition-all"
            >
              +30s
            </button>
            <button
              onClick={handleSkipRest}
              className="px-3 py-1.5 rounded-lg bg-[#201f21] hover:bg-[#2a2a2c] text-[#bbcac0] text-[12px] font-medium active:scale-95 transition-all"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Exercises Stack */}
      <div className="flex flex-col gap-4">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="w-full rounded-2xl bg-[#131315] border border-[#202024] p-4 flex flex-col shadow-sm"
          >
            {/* Exercise Header */}
            <div className="flex items-start justify-between">
              <div
                className="flex flex-col cursor-pointer"
                onClick={() => onInspectExercise(exercise.exerciseId)}
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-[17px] font-bold text-[#e5e1e4] hover:text-[#5af0b3] transition-colors">
                    {exercise.name}
                  </h3>
                  <span className="material-symbols-outlined text-[#85948b] text-[16px]">info</span>
                </div>
                <span className="text-[12px] text-[#85948b]">{exercise.muscles}</span>
              </div>

              {/* Action buttons: Plate Calc and More */}
              <div className="flex items-center gap-1">
                {exercise.equipment === 'Barbell' && (
                  <button
                    onClick={() => {
                      const firstWeight = exercise.sets[0]?.weightKg || 100;
                      onOpenPlateCalc(firstWeight);
                    }}
                    title="Calculate Barbell Plates"
                    className="w-8 h-8 rounded-lg bg-[#1b1b1d] hover:bg-[#201f21] text-[#5af0b3] flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">calculate</span>
                  </button>
                )}

                <button
                  onClick={() => onInspectExercise(exercise.exerciseId)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#85948b] hover:text-[#e5e1e4]"
                >
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </button>
              </div>
            </div>

            {/* Target or Est 1RM pill */}
            <div className="mt-2 mb-3">
              {exercise.est1RM && (
                <span className="px-2.5 py-1 rounded-full bg-[#1b1b1d] text-[#bbcac0] text-[11px] font-mono border border-[#202024]">
                  EST. 1RM <strong className="text-[#e5e1e4] font-semibold">{exercise.est1RM} kg</strong>
                </span>
              )}
              {exercise.target && (
                <span className="px-2.5 py-1 rounded-full bg-[#1b1b1d] text-[#bbcac0] text-[11px] font-mono border border-[#202024]">
                  TARGET <strong className="text-[#e5e1e4] font-semibold">{exercise.target}</strong>
                </span>
              )}
            </div>

            {/* Set Table Rows matching Image 1 & 2 */}
            <div className="flex flex-col gap-2">
              {exercise.sets.map((set, idx) => {
                const setNum = idx + 1;
                return (
                  <div
                    key={set.id}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
                      set.completed
                        ? 'bg-[#1b1b1d]/70 border-[#202024]'
                        : 'bg-[#1b1b1d] border-[#252528]'
                    }`}
                  >
                    {/* Set Type / Index Tag */}
                    <button
                      onClick={() => handleToggleSetType(exercise.id, set.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-[13px] transition-transform active:scale-95 ${
                        set.type === 'warmup'
                          ? 'bg-[#ffd16d]/20 text-[#ffd16d] border border-[#ffd16d]/40'
                          : set.type === 'drop'
                          ? 'bg-[#cebdff]/20 text-[#cebdff] border border-[#cebdff]/40'
                          : 'bg-[#201f21] text-[#bbcac0]'
                      }`}
                      title="Tap to toggle Warmup / Work / Drop set"
                    >
                      {set.type === 'warmup' ? 'W' : setNum}
                    </button>

                    {/* Weight (KG) Cell */}
                    <button
                      onClick={() =>
                        openKeypad(exercise.id, set.id, setNum, 'weight', set.weightKg)
                      }
                      className="flex-1 mx-1.5 h-10 rounded-lg bg-[#201f21] hover:bg-[#2a2a2c] flex flex-col items-center justify-center cursor-pointer transition-colors"
                    >
                      <span className="text-[10px] uppercase font-semibold text-[#85948b] leading-none">
                        kg
                      </span>
                      <span className="text-[15px] font-bold text-[#e5e1e4] tabular-nums font-mono leading-tight">
                        {set.weightKg}
                      </span>
                    </button>

                    {/* Reps Cell */}
                    <button
                      onClick={() =>
                        openKeypad(exercise.id, set.id, setNum, 'reps', set.reps)
                      }
                      className="flex-1 mx-1.5 h-10 rounded-lg bg-[#201f21] hover:bg-[#2a2a2c] flex flex-col items-center justify-center cursor-pointer transition-colors"
                    >
                      <span className="text-[10px] uppercase font-semibold text-[#85948b] leading-none">
                        reps
                      </span>
                      <span className="text-[15px] font-bold text-[#e5e1e4] tabular-nums font-mono leading-tight">
                        {set.reps}
                      </span>
                    </button>

                    {/* RPE Cell: Interactive dropdown for completed work sets, or keypad trigger */}
                    {set.completed && set.type === 'work' ? (
                      <div className="flex-1 mx-1.5 h-10 rounded-lg bg-[#201f21] hover:bg-[#2a2a2c] flex flex-col items-center justify-center relative border border-[#5af0b3]/30 px-1">
                        <span className="text-[9px] uppercase font-semibold text-[#5af0b3] leading-none">
                          rpe
                        </span>
                        <select
                          value={set.rpe !== null ? set.rpe : ''}
                          onChange={(e) => {
                            const val = e.target.value === '' ? null : parseFloat(e.target.value);
                            handleRpeChange(exercise.id, set.id, val);
                          }}
                          className="w-full bg-transparent text-[13px] font-bold text-[#e5e1e4] font-mono text-center appearance-none cursor-pointer focus:outline-none"
                          title="Select Rate of Perceived Exertion (RPE)"
                        >
                          <option value="" className="bg-[#1b1b1d] text-[#85948b]">Select</option>
                          <option value="6.0" className="bg-[#1b1b1d] text-[#e5e1e4]">6.0 (Light warmup)</option>
                          <option value="6.5" className="bg-[#1b1b1d] text-[#e5e1e4]">6.5</option>
                          <option value="7.0" className="bg-[#1b1b1d] text-[#e5e1e4]">7.0 (3 reps in tank)</option>
                          <option value="7.5" className="bg-[#1b1b1d] text-[#e5e1e4]">7.5</option>
                          <option value="8.0" className="bg-[#1b1b1d] text-[#e5e1e4]">8.0 (2 reps in tank)</option>
                          <option value="8.5" className="bg-[#1b1b1d] text-[#ffd16d]">8.5 (1-2 reps in tank)</option>
                          <option value="9.0" className="bg-[#1b1b1d] text-[#ffd16d]">9.0 (1 rep in tank)</option>
                          <option value="9.5" className="bg-[#1b1b1d] text-[#ffb4ab]">9.5 (Maybe 1 rep)</option>
                          <option value="10.0" className="bg-[#1b1b1d] text-[#ff5449]">10.0 (Absolute limit)</option>
                        </select>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          openKeypad(exercise.id, set.id, setNum, 'rpe', set.rpe)
                        }
                        className="flex-1 mx-1.5 h-10 rounded-lg bg-[#201f21] hover:bg-[#2a2a2c] flex flex-col items-center justify-center cursor-pointer transition-colors"
                      >
                        <span className="text-[10px] uppercase font-semibold text-[#85948b] leading-none">
                          rpe
                        </span>
                        <span className="text-[14px] font-bold text-[#bbcac0] tabular-nums font-mono leading-tight">
                          {set.rpe !== null ? set.rpe : '—'}
                        </span>
                      </button>
                    )}

                    {/* Tactile Completion Checkbox */}
                    <button
                      onClick={() => handleToggleSetCompletion(exercise.id, set.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        set.completed
                          ? 'bg-[#34d399] text-[#003825] shadow-[0_3px_0_0_#00563b] active:translate-y-[2px] active:shadow-none'
                          : 'bg-[#201f21] text-[#4b5563] border border-[#2a2a2c] active:bg-[#2a2a2c]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] font-bold">
                        check
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Set Button */}
            <button
              onClick={() => handleAddSet(exercise.id)}
              className="mt-3 py-2 w-full rounded-xl bg-transparent hover:bg-[#1b1b1d] text-[#5af0b3] font-semibold text-[13px] flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add set</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add Exercise Button */}
      <button
        onClick={onAddExercise}
        className="mt-4 w-full h-12 rounded-2xl bg-[#1b1b1d] hover:bg-[#201f21] border border-[#202024] text-[#e5e1e4] font-semibold text-[14px] flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
      >
        <span className="material-symbols-outlined text-[#5af0b3] text-[20px]">fitness_center</span>
        <span>Add exercise</span>
      </button>

      {/* Fixed / Bottom Finish Session Chunky Button matching Image 1 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 max-w-md mx-auto bg-gradient-to-t from-[#131315] via-[#131315]/95 to-transparent pb-safe">
        <button
          onClick={() => onFinishSession(totalVolume, elapsedSeconds)}
          className="w-full h-14 bg-[#34d399] text-[#003825] font-bold text-[16px] rounded-2xl shadow-[0_4px_0_0_#00563b] active:translate-y-[2px] active:shadow-[0_2px_0_0_#00563b] transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
        >
          <span className="material-symbols-outlined text-[20px]">flag</span>
          <span>Finish session</span>
        </button>
      </div>

      {/* Keypad Bottom Sheet */}
      <KeypadBottomSheet
        isOpen={keypadState.isOpen}
        onClose={() => setKeypadState((prev) => ({ ...prev, isOpen: false }))}
        title={keypadState.title}
        unit={keypadState.unit}
        initialValue={keypadState.value}
        onConfirm={handleKeypadConfirm}
      />
    </div>
  );
};
