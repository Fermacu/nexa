import admin, { auth, db } from '../config/firebase'
import { ValidationError } from '../utils/errors'
import { AppError } from '../utils/errors'
import type { UserRole } from '../types'

export interface RegisterUserInput {
  name: string
  email: string
  password: string
  phone?: string
}

export interface RegisterCompanyInput {
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  website?: string
  description?: string
  industry?: string
}

export interface RegisterInput {
  user: RegisterUserInput
  company: RegisterCompanyInput
}

export interface RegisterResult {
  uid: string
  email: string
  message: string
}

/**
 * Register a new user with their first company.
 * Creates Firebase Auth user, Firestore user doc, company doc, and membership.
 */
export async function register(data: RegisterInput): Promise<RegisterResult> {
  if (!auth || !db) {
    throw new AppError(
      'Missing Firebase configuration. Add FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL to apps/api/.env',
      503
    )
  }

  const FieldValue = admin.firestore.FieldValue
  const { user: userInput, company: companyInput } = data

  // 1. Create Firebase Auth user
  let firebaseUser
  try {
    firebaseUser = await auth.createUser({
      email: userInput.email,
      password: userInput.password,
      displayName: userInput.name,
    })
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists' || error.code === 'auth/email-already-in-use') {
      throw new ValidationError('Este correo ya está registrado', { userEmail: 'Este correo ya está registrado' })
    }
    if (error.code === 'auth/invalid-password') {
      throw new ValidationError('La contraseña no cumple los requisitos', { userPassword: 'Mínimo 8 caracteres con mayúsculas, minúsculas y números' })
    }
    throw error
  }

  const uid = firebaseUser.uid
  const now = FieldValue.serverTimestamp()

  try {
    // 2. Create Firestore user document
    await db.collection('users').doc(uid).set({
      name: userInput.name,
      email: userInput.email,
      ...(userInput.phone && { phone: userInput.phone }),
      createdAt: now,
    })

    // 3. Create Firestore company document
    const companyRef = db.collection('companies').doc()
    await companyRef.set({
      name: companyInput.name,
      email: companyInput.email,
      phone: companyInput.phone,
      address: companyInput.address,
      ...(companyInput.website && { website: companyInput.website }),
      ...(companyInput.description && { description: companyInput.description }),
      ...(companyInput.industry && { industry: companyInput.industry }),
      createdAt: now,
    })

    const companyId = companyRef.id

    // 4. Create membership (user is admin of the new company)
    await db.collection('memberships').add({
      userId: uid,
      companyId,
      role: 'admin' as UserRole,
      joinedAt: now,
    })
  } catch (firestoreError: any) {
    console.error('Firestore write failed:', firestoreError?.message || firestoreError)
    throw new AppError(
      firestoreError?.message?.includes('PERMISSION_DENIED')
        ? 'Firestore: permisos denegados. Activa Firestore y revisa las reglas o la cuenta de servicio.'
        : `Error al guardar en Firestore: ${firestoreError?.message || 'revisa la consola del servidor'}`,
      503
    )
  }

  return {
    uid,
    email: userInput.email,
    message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
  }
}
