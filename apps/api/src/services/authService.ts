import * as firebase from '../config/firebase';
import { ValidationError, UnauthorizedError, AppError } from '../utils/errors';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterInput {
  user: RegisterUserInput;
}

export interface RegisterResult {
  uid: string;
  email: string;
  message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  uid: string;
  email: string;
  idToken: string;
  refreshToken: string;
  message: string;
}

/**
 * Register a new user.
 * Creates Firebase Auth user and Firestore user document.
 * Users can create organizations later from their profile.
 */
export async function register(data: RegisterInput): Promise<RegisterResult> {
  if (!firebase.auth || !firebase.db) {
    throw new AppError(
      'Missing Firebase configuration. Add FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL to apps/api/.env',
      503
    );
  }

  const FieldValue = firebase.default.firestore.FieldValue;
  const { user: userInput } = data;

  // 1. Create Firebase Auth user
  let firebaseUser;
  try {
    firebaseUser = await firebase.auth.createUser({
      email: userInput.email,
      password: userInput.password,
      displayName: userInput.name,
    });
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists' || error.code === 'auth/email-already-in-use') {
      throw new ValidationError('Este correo ya está registrado', {
        userEmail: 'Este correo ya está registrado',
      });
    }
    if (error.code === 'auth/invalid-password') {
      throw new ValidationError('La contraseña no cumple los requisitos', {
        userPassword: 'Mínimo 8 caracteres con mayúsculas, minúsculas y números',
      });
    }
    throw error;
  }

  const uid = firebaseUser.uid;
  const now = FieldValue.serverTimestamp();

  // 2. Create Firestore user document
  await firebase.db.collection('users').doc(uid).set({
    name: userInput.name,
    email: userInput.email,
    ...(userInput.phone && { phone: userInput.phone }),
    createdAt: now,
  });

  return {
    uid,
    email: userInput.email,
    message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
  };
}

/**
 * Login a user with email and password.
 * Uses Firebase Auth REST API to authenticate and get tokens.
 */
export async function login(data: LoginInput): Promise<LoginResult> {
  const { email, password } = data;

  // Check if Firebase Web API Key is configured
  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) {
    throw new AppError(
      'Missing FIREBASE_WEB_API_KEY in environment variables. Add it to apps/api/.env',
      503
    );
  }

  // Use Firebase Auth REST API to sign in
  const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  try {
    const response = await fetch(firebaseAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Handle Firebase Auth errors
      if (result.error) {
        const errorCode = result.error.message;
        
        if (errorCode.includes('EMAIL_NOT_FOUND') || errorCode.includes('INVALID_PASSWORD')) {
          throw new UnauthorizedError('Correo electrónico o contraseña incorrectos');
        }
        
        if (errorCode.includes('USER_DISABLED')) {
          throw new UnauthorizedError('Esta cuenta ha sido deshabilitada');
        }
        
        if (errorCode.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
          throw new UnauthorizedError('Demasiados intentos fallidos. Intenta más tarde');
        }

        throw new UnauthorizedError('Error al iniciar sesión');
      }
      
      throw new AppError('Error al autenticar con Firebase', 500);
    }

    // Get user data from Firestore
    if (!firebase.db) {
      throw new AppError('Firebase database not configured', 503);
    }

    const userDoc = await firebase.db.collection('users').doc(result.localId).get();
    
    if (!userDoc.exists) {
      throw new UnauthorizedError('Usuario no encontrado en la base de datos');
    }

    return {
      uid: result.localId,
      email: result.email,
      idToken: result.idToken,
      refreshToken: result.refreshToken,
      message: 'Inicio de sesión exitoso',
    };
  } catch (error: any) {
    // Re-throw known errors
    if (error instanceof UnauthorizedError || error instanceof AppError) {
      throw error;
    }
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new AppError('Error de conexión con el servicio de autenticación', 503);
    }
    
    throw new AppError('Error inesperado al iniciar sesión', 500);
  }
}
