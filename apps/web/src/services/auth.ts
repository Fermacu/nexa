/**
 * Authentication Service
 * 
 * Service for handling authentication operations (login, register, etc.)
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  uid: string;
  email: string;
  idToken: string;
  refreshToken: string;
  message: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterCompanyInput {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  website?: string;
  description?: string;
  industry?: string;
}

export interface RegisterInput {
  user: RegisterUserInput;
  company: RegisterCompanyInput;
}

export interface RegisterResponse {
  uid: string;
  email: string;
  message: string;
}

/**
 * Store authentication token
 */
export function storeAuthToken(token: string, useSessionStorage = false): void {
  if (typeof window === 'undefined') return;

  const storage = useSessionStorage ? sessionStorage : localStorage;
  storage.setItem('auth_token', token);
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_token');
}

/**
 * Login user
 */
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    API_ENDPOINTS.auth.login,
    credentials
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Error al iniciar sesión');
  }

  // Store the token
  storeAuthToken(response.data.idToken);

  return response.data;
}

/**
 * Register new user with company
 */
export async function register(
  data: RegisterInput
): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>(
    API_ENDPOINTS.auth.register,
    data
  );

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Error al registrar');
  }

  return response.data;
}

/**
 * Logout user
 */
export function logout(): void {
  removeAuthToken();
}
