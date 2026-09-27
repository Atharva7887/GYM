export type TabType = 'log' | 'history' | 'food' | 'exercises';

export type ScreenView = 
  | { type: 'main' }
  | { type: 'active-workout' }
  | { type: 'barcode-scanner'; targetMeal?: string }
  | { type: 'exercise-detail'; exerciseId: string }
  | { type: 'licenses' }
  | { type: 'plate-calculator'; initialWeight?: number };

export interface SetEntry {
  id: string;
  type: 'warmup' | 'work' | 'drop';
  weightKg: number;
  reps: number;
  rpe: number | null;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  muscles: string;
  equipment: string;
  target?: string;
  prevInfo?: string;
  est1RM?: number;
  restTimeSeconds?: number;
  sets: SetEntry[];
}

export interface RoutineTemplate {
  id: string;
  title: string;
  subtitle: string;
  exerciseCount: number;
  exercises: {
    name: string;
    muscles: string;
    equipment: string;
    sets: number;
    reps: string;
    weight: number;
  }[];
}

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  fiber?: number;
  barcode?: string;
}

export interface MealCategory {
  id: string;
  name: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  icon: string;
  kcal: number;
  items: FoodItem[];
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  tags: string[];
  suggested: {
    sets: string;
    reps: string;
    rest: string;
    level: string;
  };
  howToPerform: string[];
  formCues: string[];
  historyPoints: { session: string; est1RM: number }[];
  bestEst1RM: number;
}
