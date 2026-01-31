/**
 * Firebase client configuration for the web app.
 * Uses environment variables prefixed with NEXT_PUBLIC_ so they are available in the browser.
 *
 * Get these values from Firebase Console → Project Settings → General → Your apps.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined' || !firebaseConfig.apiKey) return null
  const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
  return getAuth(app)
}

export const auth = getFirebaseAuth()
export { firebaseConfig }
