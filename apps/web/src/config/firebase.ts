/**
 * Firebase client configuration for the web app.
 * Uses environment variables prefixed with NEXT_PUBLIC_ so they are available in the browser.
 *
 * Get these values from Firebase Console → Project Settings → General → Your apps.
 * Add them in apps/web/.env.local and restart the dev server.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth as getFirebaseAuth, type Auth } from 'firebase/auth'

let authInstance: Auth | null = null

function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
}

/**
 * Returns Firebase Auth instance. Call this in the browser (e.g. in event handlers or useEffect).
 * Returns null on the server or if NEXT_PUBLIC_* env vars are missing.
 */
export function getAuth(): Auth | null {
  if (typeof window === 'undefined') return null
  const config = getFirebaseConfig()
  if (!config.apiKey?.trim()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Firebase] No se inicializó: faltan variables NEXT_PUBLIC_FIREBASE_* en .env.local. ' +
          'Cópialas desde Firebase Console → Project Settings → General → Your apps. Reinicia el servidor (npm run dev) después de crear .env.local.'
      )
    }
    return null
  }
  if (authInstance) return authInstance
  const app: FirebaseApp = getApps().length ? getApp() : initializeApp(config)
  authInstance = getFirebaseAuth(app)
  return authInstance
}

/**
 * @deprecated Use getAuth() so Auth is initialized in the browser. Kept for backward compatibility.
 */
export const auth = typeof window !== 'undefined' ? getAuth() : null
