import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import type { User } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

const defaultStats = {
  countriesVisited: 0,
  citiesVisited: 0,
  totalTrips: 0,
  totalDistance: 0,
  travelStreak: 0,
  wishlistCount: 0,
};

const defaultSettings = {
  theme: 'dark' as const,
  currency: 'USD',
  language: 'en',
  units: 'metric' as const,
  notifications: true,
  privacy: 'public' as const,
  nationality: 'us',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserProfile(uid: string) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as User);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function register(email: string, password: string, name: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    const profile: Partial<User> = {
      uid: result.user.uid,
      email,
      displayName: name,
      createdAt: new Date(),
      travelStats: defaultStats,
      settings: defaultSettings,
    };
    await setDoc(doc(db, 'users', result.user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
    });
    setUserProfile(profile as User);
  }

  async function logout() {
    await signOut(auth);
  }

  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        travelStats: defaultStats,
        settings: defaultSettings,
      });
    }
    await fetchUserProfile(user.uid);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async function updateUserProfile(data: Partial<User>) {
    if (!currentUser) return;
    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, data, { merge: true });
    setUserProfile((prev) => prev ? { ...prev, ...data } : null);
  }

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
