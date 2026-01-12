/**
 * Shared Type Definitions
 * 
 * Centralized type definitions for the NEXA application.
 * This ensures type consistency across the entire application.
 */

// User Types
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: string
}

// Company Types
export interface CompanyAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Company {
  id: string
  name: string
  email: string
  phone: string
  address: CompanyAddress
  website?: string
  description?: string
  industry?: string
  createdAt: string
}

// Company Membership Types
export type UserRole = 'admin' | 'member' | 'viewer'

export interface CompanyMembership {
  companyId: string
  companyName: string
  role: UserRole
  joinedAt: string
  company: Company
}

// API Error Types
export interface ApiError {
  message: string
  errors?: Record<string, string>
  statusCode?: number
}

export interface ApiErrorResponse {
  response?: {
    data?: {
      errors?: Record<string, string>
    }
  }
  message?: string
}
