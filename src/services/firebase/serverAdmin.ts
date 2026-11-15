/**
 * Firebase Admin SDK (Server / Cloud Function only)
 * Never import or expose this file to client browser code!
 */
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | null = null;

export const getFirebaseAdminApp = (): App => {
  if (adminApp) return adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0]!;
    return adminApp;
  }

  // 1. Read base64 encoded service account from env
  const b64 = typeof process !== 'undefined' ? process.env.FIREBASE_SERVICE_ACCOUNT : undefined;
  if (!b64) {
    throw new Error('[Firebase Admin] Missing FIREBASE_SERVICE_ACCOUNT environment variable');
  }

  try {
    const jsonStr = Buffer.from(b64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(jsonStr);

    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || 'carecircle-4ec05',
    });

    return adminApp;
  } catch (err) {
    throw new Error(`[Firebase Admin] Failed to parse service account credential: ${err}`);
  }
};

export const getAdminFirestore = (): Firestore => {
  return getFirestore(getFirebaseAdminApp());
};

export const getAdminAuth = (): Auth => {
  return getAuth(getFirebaseAdminApp());
};
