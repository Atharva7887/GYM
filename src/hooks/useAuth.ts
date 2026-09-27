import { useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      // Gracefully handle user cancellation or popup closing without polluting error logs
      const fbError = err as { code?: string; message?: string };
      if (
        fbError?.code === 'auth/popup-closed-by-user' ||
        fbError?.code === 'auth/cancelled-popup-request'
      ) {
        // User voluntarily closed the authentication window
        setError(null);
        return;
      }
      if (fbError?.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked by browser. Please enable popups for this site.');
        return;
      }
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      console.warn('Firebase Auth note:', msg);
      setError(msg);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await fbSignOut(auth);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign out failed';
      console.error('Sign out error:', err);
      setError(msg);
    }
  };

  return { user, loading, error, signInWithGoogle, signOut };
}
