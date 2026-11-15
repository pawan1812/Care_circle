import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Helper to safely read env variables across Vite, Next.js, and Node runtimes
const getEnvVar = (viteKey: string, nextKey: string, fallback = ''): string => {
  // 1. Check Vite import.meta.env
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env[viteKey]) return import.meta.env[viteKey];
      if (import.meta.env[nextKey]) return import.meta.env[nextKey];
    }
  } catch {}

  // 2. Check process.env (Node / SSR)
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[nextKey]) return process.env[nextKey];
      if (process.env[viteKey]) return process.env[viteKey];
    }
  } catch {}

  return fallback;
};

// Client Firebase Configuration (Modular v10+ SDK)
export const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_API_KEY', 'AIzaSyCareCircleProdClientKey4ec05'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'carecircle-4ec05.firebaseapp.com'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'carecircle-4ec05'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'carecircle-4ec05.appspot.com'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', '110115441295869757627'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', 'NEXT_PUBLIC_FIREBASE_APP_ID', '1:110115441295869757627:web:carecircle4ec05'),
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.projectId && firebaseConfig.projectId !== '');
};

// Initialize or reuse Firebase App instance
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  try {
    // Enable multi-tab persistent cache for instant offline schedule access (PRD §11.5)
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    db = getFirestore(app);
  }
  auth = getAuth(app);
} else {
  app = getApp();
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, db, auth };

