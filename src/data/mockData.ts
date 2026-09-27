import { ExerciseDefinition, MealCategory, RoutineTemplate, WorkoutExercise } from '../types';

export const INITIAL_ROUTINES: RoutineTemplate[] = [
  {
    id: 'push-day',
    title: 'Push Day',
    subtitle: 'Chest, shoulders, triceps',
    exerciseCount: 6,
    exercises: [
      { name: 'Barbell Bench Press', muscles: 'Chest · Triceps', equipment: 'Barbell', sets: 4, reps: '5-8', weight: 85 },
      { name: 'Incline Dumbbell Press', muscles: 'Chest · Shoulders', equipment: 'Dumbbells', sets: 3, reps: '8-10', weight: 32 },
      { name: 'Overhead Press', muscles: 'Shoulders · Triceps', equipment: 'Barbell', sets: 3, reps: '5', weight: 60 },
      { name: 'Dumbbell Lateral Raise', muscles: 'Lateral Delts', equipment: 'Dumbbells', sets: 4, reps: '12-15', weight: 14 },
      { name: 'Tricep Rope Pushdown', muscles: 'Triceps', equipment: 'Cable', sets: 3, reps: '10-12', weight: 35 },
      { name: 'Chest Cable Flyes', muscles: 'Pectorals', equipment: 'Cable', sets: 3, reps: '12-15', weight: 20 },
    ],
  },
  {
    id: 'pull-day',
    title: 'Pull Day',
    subtitle: 'Back, biceps',
    exerciseCount: 5,
    exercises: [
      { name: 'Conventional Deadlift', muscles: 'Posterior Chain', equipment: 'Barbell', sets: 3, reps: '3-5', weight: 165 },
      { name: 'Barbell Bent Over Row', muscles: 'Lats · Upper Back', equipment: 'Barbell', sets: 4, reps: '6-8', weight: 80 },
      { name: 'Weighted Pull-Ups', muscles: 'Lats · Biceps', equipment: 'Bodyweight', sets: 4, reps: '6', weight: 15 },
      { name: 'Face Pulls', muscles: 'Rear Delts · Rotators', equipment: 'Cable', sets: 4, reps: '15', weight: 27.5 },
      { name: 'Incline Dumbbell Curl', muscles: 'Biceps', equipment: 'Dumbbells', sets: 3, reps: '10-12', weight: 16 },
    ],
  },
  {
    id: 'leg-day',
    title: 'Leg Day',
    subtitle: 'Quads, hamstrings',
    exerciseCount: 6,
    exercises: [
      { name: 'Barbell Back Squat', muscles: 'Quads · Glutes', equipment: 'Barbell', sets: 4, reps: '5', weight: 140 },
      { name: 'Romanian Deadlift', muscles: 'Hamstrings · Glutes', equipment: 'Barbell', sets: 3, reps: '8', weight: 110 },
      { name: 'Leg Press 45°', muscles: 'Quads', equipment: 'Machine', sets: 3, reps: '10-12', weight: 220 },
      { name: 'Lying Leg Curls', muscles: 'Hamstrings', equipment: 'Machine', sets: 4, reps: '10-12', weight: 55 },
      { name: 'Standing Calf Raise', muscles: 'Calves', equipment: 'Machine', sets: 4, reps: '15', weight: 90 },
      { name: 'Hanging Leg Raises', muscles: 'Abs', equipment: 'Bar', sets: 3, reps: '15', weight: 0 },
    ],
  },
  {
    id: 'full-body',
    title: 'Full Body',
    subtitle: 'Compound',
    exerciseCount: 4,
    exercises: [
      { name: 'Barbell Back Squat', muscles: 'Quads · Glutes', equipment: 'Barbell', sets: 3, reps: '5', weight: 135 },
      { name: 'Barbell Bench Press', muscles: 'Chest · Triceps', equipment: 'Barbell', sets: 3, reps: '5', weight: 85 },
      { name: 'Conventional Deadlift', muscles: 'Posterior Chain', equipment: 'Barbell', sets: 2, reps: '5', weight: 160 },
      { name: 'Overhead Press', muscles: 'Shoulders', equipment: 'Barbell', sets: 3, reps: '5', weight: 57.5 },
    ],
  },
];

export const INITIAL_ACTIVE_EXERCISES: WorkoutExercise[] = [
  {
    id: 'ex-1',
    exerciseId: 'bench-press',
    name: 'Barbell Bench Press',
    muscles: 'Chest · Triceps',
    equipment: 'Barbell',
    est1RM: 102.5,
    restTimeSeconds: 120,
    sets: [
      { id: 's1', type: 'warmup', weightKg: 60, reps: 10, rpe: 7, completed: true },
      { id: 's2', type: 'work', weightKg: 85, reps: 5, rpe: 8, completed: true },
      { id: 's3', type: 'work', weightKg: 85, reps: 5, rpe: 8.5, completed: true },
      { id: 's4', type: 'work', weightKg: 85, reps: 5, rpe: null, completed: false },
    ],
  },
  {
    id: 'ex-2',
    exerciseId: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    muscles: 'Chest · Shoulders',
    equipment: 'Dumbbells',
    target: '32 kg × 8-10 reps',
    restTimeSeconds: 90,
    sets: [
      { id: 's5', type: 'work', weightKg: 32, reps: 10, rpe: null, completed: false },
      { id: 's6', type: 'work', weightKg: 32, reps: 8, rpe: null, completed: false },
      { id: 's7', type: 'work', weightKg: 30, reps: 8, rpe: null, completed: false },
    ],
  },
];

export const BENCH_PRESS_DETAIL: ExerciseDefinition = {
  id: 'bench-press',
  name: 'Barbell Bench Press',
  tags: ['Chest', 'Triceps', 'Barbell'],
  suggested: {
    sets: '3–4',
    reps: '6–10',
    rest: '2–3m',
    level: 'Beginner · adjust as you progress.',
  },
  howToPerform: [
    'Lie back on the bench, retract your shoulder blades, and grip the bar firmly slightly wider than shoulder-width with wrists straight.',
    'Unrack the bar by extending your arms and pull it directly over your sternum, locking your lats before beginning descent.',
    'Lower the bar under strict control down to touch your mid-sternum, keeping elbows tucked comfortably at roughly 45 to 70 degrees.',
    'Drive hard through the floor and press the bar upwards in a subtle back-arc toward your upper chest without flaring your elbows wide.',
  ],
  formCues: [
    'Keep your shoulder blades pinched back',
    'Drive your feet into the floor',
    'Bar path is a shallow arc, not a straight line down',
  ],
  historyPoints: [
    { session: 'Aug 04', est1RM: 92.5 },
    { session: 'Aug 12', est1RM: 95.0 },
    { session: 'Aug 20', est1RM: 95.0 },
    { session: 'Aug 29', est1RM: 97.5 },
    { session: 'Sep 06', est1RM: 100.0 },
    { session: 'Sep 14', est1RM: 100.0 },
    { session: 'Sep 19', est1RM: 102.5 },
    { session: 'Sep 24', est1RM: 102.5 },
  ],
  bestEst1RM: 102.5,
};

export const ALL_EXERCISE_DEFINITIONS: ExerciseDefinition[] = [
  BENCH_PRESS_DETAIL,
  {
    id: 'back-squat',
    name: 'Barbell Back Squat',
    tags: ['Quads', 'Glutes', 'Barbell'],
    suggested: {
      sets: '3–5',
      reps: '3–6',
      rest: '3–4m',
      level: 'Intermediate · heavy compound focus.',
    },
    howToPerform: [
      'Position bar firmly on rear delts, take a shoulder-width stance with toes flared slightly outwards.',
      'Take a deep intra-abdominal breath, brace 360°, and unlock hips and knees simultaneously.',
      'Descend until crease of hip is below top of patella while keeping chest proud and knees tracking toes.',
      'Drive powerfully out of the hole by pushing the floor away through midfoot.',
    ],
    formCues: [
      'Maintain ribcage-to-pelvis canister brace',
      'Knees track in line with 2nd toe',
      'Midfoot balance throughout ascent and descent',
    ],
    historyPoints: [
      { session: 'Jul 28', est1RM: 135.0 },
      { session: 'Aug 10', est1RM: 137.5 },
      { session: 'Aug 24', est1RM: 142.5 },
      { session: 'Sep 05', est1RM: 145.0 },
      { session: 'Sep 22', est1RM: 147.5 },
    ],
    bestEst1RM: 147.5,
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    tags: ['Back', 'Hamstrings', 'Barbell'],
    suggested: {
      sets: '3–4',
      reps: '3–5',
      rest: '3–5m',
      level: 'Advanced · neural max effort.',
    },
    howToPerform: [
      'Stand with midfoot under the bar with feet hip-width apart.',
      'Hinge forward without bending knees much until you grip the knurling just outside shins.',
      'Pull slack out of the barbell until clicking sound, wedge hips forward and engage lats.',
      'Drive the floor away with legs until knees pass bar, then snap hips into lockout.',
    ],
    formCues: [
      'Bar stays glued against shins and thighs',
      'Pull slack out before initiating lift',
      'Do not hyperextend lumbar spine at lockout',
    ],
    historyPoints: [
      { session: 'Jul 28', est1RM: 175.0 },
      { session: 'Aug 14', est1RM: 177.5 },
      { session: 'Aug 28', est1RM: 180.0 },
      { session: 'Sep 12', est1RM: 182.5 },
      { session: 'Sep 20', est1RM: 185.0 },
    ],
    bestEst1RM: 185.0,
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    tags: ['Shoulders', 'Triceps', 'Barbell'],
    suggested: {
      sets: '3–4',
      reps: '5–8',
      rest: '2–3m',
      level: 'Intermediate · strict cadence.',
    },
    howToPerform: [
      'Unrack bar at upper collarbone height with narrow grip, forearms vertical.',
      'Squeeze glutes and quads rock solid, tilt head back slightly to clear chin.',
      'Drive barbell straight upward in a tight vertical trajectory.',
      'Once bar clears forehead, bring head forward and lock out overhead with active shrug.',
    ],
    formCues: [
      'Glutes and core locked to prevent back arch',
      'Vertical forearms at starting position',
      'Shrug traps up slightly at lockout',
    ],
    historyPoints: [
      { session: 'Aug 02', est1RM: 60.0 },
      { session: 'Aug 18', est1RM: 62.5 },
      { session: 'Sep 01', est1RM: 65.0 },
      { session: 'Sep 24', est1RM: 67.5 },
    ],
    bestEst1RM: 67.5,
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    tags: ['Chest', 'Shoulders', 'Dumbbells'],
    suggested: {
      sets: '3–4',
      reps: '8–12',
      rest: '2m',
      level: 'Beginner · 30 degree incline.',
    },
    howToPerform: [
      'Set bench to 30 degrees incline. Kick dumbbells up to shoulders with knees.',
      'Retract scapulae and press weights up with neutral-to-semi-pronated wrist angle.',
      'Lower weights with controlled 3-second eccentric until full chest stretch.',
      'Converge slightly near the top without clinking dumbbells.',
    ],
    formCues: [
      'Do not exceed 30° to 45° bench angle',
      'Keep shoulder blades pinned to bench',
      'Control eccentric descent',
    ],
    historyPoints: [
      { session: 'Aug 10', est1RM: 36.0 },
      { session: 'Sep 02', est1RM: 38.0 },
      { session: 'Sep 24', est1RM: 40.0 },
    ],
    bestEst1RM: 40.0,
  },
];

export const INITIAL_MEALS: MealCategory[] = [
  {
    id: 'meal-breakfast',
    name: 'Breakfast',
    icon: 'free_breakfast',
    kcal: 510,
    items: [
      { id: 'b1', name: 'Eggs (boiled)', portion: '3 large (150 g)', kcal: 234, p: 18.9, c: 1.6, f: 15.9, fiber: 0 },
      { id: 'b2', name: 'Rolled Oats with Whole Milk', portion: '1 bowl (250 g)', kcal: 276, p: 11.2, c: 36.4, f: 9.8, fiber: 4.5 },
    ],
  },
  {
    id: 'meal-lunch',
    name: 'Lunch',
    icon: 'lunch_dining',
    kcal: 680,
    items: [
      { id: 'l1', name: 'Roti (Whole Wheat Atta)', portion: '3 rotis (105 g)', kcal: 315, p: 9.6, c: 57.0, f: 4.5, fiber: 6.2 },
      { id: 'l2', name: 'Yellow Moong Dal Tadka', portion: '1.5 katori (225 g)', kcal: 225, p: 14.1, c: 31.5, f: 4.8, fiber: 8.5 },
      { id: 'l3', name: 'Paneer (fresh raw)', portion: '50 g', kcal: 140, p: 9.1, c: 1.8, f: 11.0, fiber: 0 },
    ],
  },
  {
    id: 'meal-dinner',
    name: 'Dinner',
    icon: 'dinner_dining',
    kcal: 480,
    items: [
      { id: 'd1', name: 'Chicken Breast Curry', portion: '150 g', kcal: 260, p: 38.0, c: 4.0, f: 10.0, fiber: 1.5 },
      { id: 'd2', name: 'Cooked Basmati Rice', portion: '1 katori (150 g)', kcal: 195, p: 3.8, c: 43.5, f: 0.6, fiber: 0.8 },
      { id: 'd3', name: 'Ghee', portion: '0.5 tbsp (7 g)', kcal: 62, p: 0.0, c: 0.0, f: 7.0, fiber: 0 },
    ],
  },
  {
    id: 'meal-snacks',
    name: 'Snacks',
    icon: 'cookie',
    kcal: 170,
    items: [
      { id: 's1', name: 'Whey Protein Isolate', portion: '1 scoop (32 g)', kcal: 120, p: 25.0, c: 1.5, f: 0.8, fiber: 0 },
      { id: 's2', name: 'Banana (medium)', portion: '1 unit (100 g)', kcal: 89, p: 1.1, c: 22.8, f: 0.3, fiber: 2.6 },
    ],
  },
];

export interface PackagedFoodProduct {
  barcode: string;
  name: string;
  portion: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  fiber: number;
  brand: string;
}

export const OFFLINE_PACKAGED_DB: PackagedFoodProduct[] = [
  {
    barcode: '8901030825407',
    name: 'Amul Gold Homogenised Standardised Milk',
    portion: '500 ml pouch',
    kcal: 60,
    p: 3.2,
    c: 4.7,
    f: 3.6,
    fiber: 0,
    brand: 'Amul',
  },
  {
    barcode: '8901719114227',
    name: 'Epigamia Greek Yogurt Natural',
    portion: '100 g cup',
    kcal: 85,
    p: 8.0,
    c: 6.0,
    f: 3.0,
    fiber: 0,
    brand: 'Epigamia',
  },
  {
    barcode: '8901058852331',
    name: 'Quaker Rolled Oats 100% Wholegrain',
    portion: '1 bowl (40 g dry)',
    kcal: 158,
    p: 5.5,
    c: 26.5,
    f: 3.2,
    fiber: 4.2,
    brand: 'Quaker',
  },
  {
    barcode: '8901262010052',
    name: 'Tata Sampann Unpolished Moong Dal',
    portion: '100 g dry',
    kcal: 342,
    p: 24.0,
    c: 58.0,
    f: 1.2,
    fiber: 9.0,
    brand: 'Tata Sampann',
  },
  {
    barcode: '8901233024018',
    name: 'Optimum Nutrition Gold Standard Whey',
    portion: '1 scoop (30.4 g)',
    kcal: 120,
    p: 24.0,
    c: 3.0,
    f: 1.5,
    fiber: 0,
    brand: 'Optimum Nutrition',
  },
  {
    barcode: '8906004450123',
    name: 'Mother Dairy Classic Dahi',
    portion: '200 g cup',
    kcal: 128,
    p: 7.4,
    c: 9.0,
    f: 6.8,
    fiber: 0,
    brand: 'Mother Dairy',
  },
];

export interface HistoryWorkoutItem {
  id: string;
  title: string;
  dateTag: string;
  timeRange: string;
  volumeKg: number;
  setsCount: number;
  exercisesCount: number;
  chips: string[];
}

export const INITIAL_LOGGED_WORKOUTS: HistoryWorkoutItem[] = [
  {
    id: 'w-1',
    title: 'Hypertrophy Push & Delts',
    dateTag: 'Thu, Sep 24',
    timeRange: '07:15 - 08:35',
    volumeKg: 14220,
    setsCount: 18,
    exercisesCount: 5,
    chips: ['BENCH 4X6 @ 87.5KG', 'INCLINE DB 3X10', 'LATERAL RAISES 4X15'],
  },
  {
    id: 'w-2',
    title: 'Lower Strength (Squat Focus)',
    dateTag: 'Tue, Sep 22',
    timeRange: '18:00 - 19:20',
    volumeKg: 15920,
    setsCount: 22,
    exercisesCount: 6,
    chips: ['PR SQUAT 5X5 @ 125KG', 'ROMANIAN DEADLIFT 3X8', 'CALF PRESS 4X12'],
  },
  {
    id: 'w-3',
    title: 'Posterior Chain & Pull',
    dateTag: 'Sun, Sep 20',
    timeRange: '09:40 - 10:55',
    volumeKg: 11840,
    setsCount: 19,
    exercisesCount: 5,
    chips: ['DEADLIFT 3X3 @ 165KG', 'BARBELL ROW 4X8', 'PULL-UPS 4XBW'],
  },
];
