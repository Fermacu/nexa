/**
 * Company Service
 * 
 * Service for handling company-related operations
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';

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
 * Get company by ID
 */
export async function getCompanyById(companyId: string): Promise<Company> {
  const response = await apiClient.get<Company>(API_ENDPOINTS.companies.byId(companyId));

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to get company');
  }

  return response.data;
}

/**
 * Update company information
 */
export async function updateCompany(companyId: string, data: UpdateCompanyInput): Promise<Company> {
  const response = await apiClient.put<Company>(API_ENDPOINTS.companies.byId(companyId), data);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update company');
  }

  return response.data;
}
