/**
 * User Service
 * 
 * Service for handling user-related operations
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
}

export interface CompanyMembership {
  companyId: string;
  companyName: string;
  role: string;
  joinedAt: string;
  company: {
    id: string;
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
    createdAt: string;
  };
}

/**
 * Get current user information
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>(API_ENDPOINTS.users.me);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to get user');
  }

  return response.data;
}

/**
 * Update current user information
 */
export async function updateCurrentUser(data: UpdateUserInput): Promise<User> {
  const response = await apiClient.put<User>(API_ENDPOINTS.users.me, data);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update user');
  }

  return response.data;
}

/**
 * Get current user's companies
 */
export async function getCurrentUserCompanies(): Promise<CompanyMembership[]> {
  const response = await apiClient.get<CompanyMembership[]>(API_ENDPOINTS.users.myCompanies);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to get companies');
  }

  return response.data;
}
