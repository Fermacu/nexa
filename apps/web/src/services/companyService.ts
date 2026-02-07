/**
 * Company Service
 * 
 * Service for handling company-related operations
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';
import type { CompanyMember } from '@app/types';

export interface Company {
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
}

export interface CreateCompanyInput {
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

export interface UpdateCompanyInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  website?: string;
  description?: string;
  industry?: string;
}

/**
 * Create a new company
 */
export async function createCompany(data: CreateCompanyInput): Promise<Company> {
  const response = await apiClient.post<Company>(API_ENDPOINTS.companies.create, data);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Error al crear la organización');
  }

  return response.data;
}

/**
 * Get company by ID
 */
export async function getCompanyById(companyId: string): Promise<Company> {
  const response = await apiClient.get<Company>(API_ENDPOINTS.companies.byId(companyId));

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Error al obtener la empresa');
  }

  return response.data;
}

/**
 * Update company information
 */
export async function updateCompany(companyId: string, data: UpdateCompanyInput): Promise<Company> {
  const response = await apiClient.put<Company>(API_ENDPOINTS.companies.byId(companyId), data);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Error al actualizar la empresa');
  }

  return response.data;
}

/**
 * Get list of members for a company (requires owner or admin role)
 */
export async function getCompanyMembers(companyId: string): Promise<CompanyMember[]> {
  const response = await apiClient.get<CompanyMember[]>(API_ENDPOINTS.companies.members(companyId));

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Error al cargar los miembros');
  }

  return response.data;
}

export type AddCompanyMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface AddCompanyMemberInput {
  email: string;
  role: AddCompanyMemberRole;
}

/**
 * Send an invitation to join the company (requires owner or admin role).
 * The invitee must accept the invitation to become a member.
 * Admin cannot assign owner; owner can assign any role.
 */
export async function addCompanyMember(
  companyId: string,
  data: AddCompanyMemberInput
): Promise<{ invitationSent: boolean }> {
  const response = await apiClient.post<{ invitationSent: boolean }>(
    API_ENDPOINTS.companies.members(companyId),
    data
  );

  if (!response.success) {
    throw new Error(response.error?.message || 'Error al enviar la invitación');
  }

  return response.data ?? { invitationSent: true };
}
