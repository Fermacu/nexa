import admin from 'firebase-admin'

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const hasConfig =
    process.env.FIREBASE_PROJECT_ID && privateKey && process.env.FIREBASE_CLIENT_EMAIL

  if (hasConfig) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    })
  }
}

export const auth = admin.apps.length ? admin.auth() : (null as unknown as ReturnType<typeof admin.auth>)
export const db = admin.apps.length ? admin.firestore() : (null as unknown as ReturnType<typeof admin.firestore>)
export default admin