import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RoutineTemplate, MealCategory, FoodItem } from '../types';
import { HistoryWorkoutItem } from '../data/mockData';

// Save or sync workout to Firestore
export async function saveWorkoutToFirestore(userId: string, workout: HistoryWorkoutItem) {
  try {
    const workoutRef = doc(db, 'users', userId, 'workouts', workout.id);
    await setDoc(workoutRef, {
      ...workout,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save workout to Firestore:', err);
  }
}

// Delete workout from Firestore
export async function deleteWorkoutFromFirestore(userId: string, workoutId: string) {
  try {
    const workoutRef = doc(db, 'users', userId, 'workouts', workoutId);
    await deleteDoc(workoutRef);
  } catch (err) {
    console.error('Failed to delete workout from Firestore:', err);
  }
}

// Fetch user workouts from Firestore
export async function fetchUserWorkouts(userId: string): Promise<HistoryWorkoutItem[]> {
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'workouts'));
    const list: HistoryWorkoutItem[] = [];
    snap.forEach((d) => {
      list.push(d.data() as HistoryWorkoutItem);
    });
    return list;
  } catch (err) {
    console.error('Failed to fetch workouts from Firestore:', err);
    return [];
  }
}

// Save or sync routine to Firestore
export async function saveRoutineToFirestore(userId: string, routine: RoutineTemplate) {
  try {
    const routineRef = doc(db, 'users', userId, 'routines', routine.id);
    await setDoc(routineRef, {
      ...routine,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save routine to Firestore:', err);
  }
}

// Fetch user routines from Firestore
export async function fetchUserRoutines(userId: string): Promise<RoutineTemplate[]> {
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'routines'));
    const list: RoutineTemplate[] = [];
    snap.forEach((d) => {
      list.push(d.data() as RoutineTemplate);
    });
    return list;
  } catch (err) {
    console.error('Failed to fetch routines from Firestore:', err);
    return [];
  }
}

// Save meals state to Firestore
export async function saveMealsToFirestore(userId: string, meals: MealCategory[]) {
  try {
    const mealsRef = doc(db, 'users', userId, 'meals', 'daily-log');
    await setDoc(mealsRef, {
      categories: meals,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Failed to save meals to Firestore:', err);
  }
}

// Fetch meals state from Firestore
export async function fetchUserMeals(userId: string): Promise<MealCategory[] | null> {
  try {
    const snap = await getDocs(collection(db, 'users', userId, 'meals'));
    let meals: MealCategory[] | null = null;
    snap.forEach((d) => {
      if (d.id === 'daily-log' && d.data()?.categories) {
        meals = d.data().categories as MealCategory[];
      }
    });
    return meals;
  } catch (err) {
    console.error('Failed to fetch meals from Firestore:', err);
    return null;
  }
}
