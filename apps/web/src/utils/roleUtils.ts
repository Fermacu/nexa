/**
 * Role Utility Functions
 * 
 * Helper functions for managing user roles and permissions
 */

import type { UserRole } from '@app/types'

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Propietario',
  admin: 'Administrador',
  member: 'Miembro',
  viewer: 'Visor',
}

const ROLE_COLORS: Record<UserRole, 'primary' | 'default' | 'secondary' | 'success' | 'warning'> = {
  owner: 'warning',
  admin: 'primary',
  member: 'default',
  viewer: 'secondary',
}

/**
 * Get the display label for a user role
 */
export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role as UserRole] || role
}

/**
 * Get the Material-UI color for a user role chip
 */
export function getRoleColor(role: string): 'primary' | 'default' | 'secondary' | 'success' {
  return ROLE_COLORS[role as UserRole] || 'default'
}
