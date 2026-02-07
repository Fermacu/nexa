/**
 * Invitation Service
 *
 * Accept or decline company invitations.
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';

/**
 * Accept a company invitation
 */
export async function acceptInvitation(invitationId: string): Promise<void> {
  const response = await apiClient.post(API_ENDPOINTS.invitations.accept(invitationId));

  if (!response.success) {
    throw new Error(response.error?.message || 'Error al aceptar la invitación');
  }
}

/**
 * Decline a company invitation
 */
export async function declineInvitation(invitationId: string): Promise<void> {
  const response = await apiClient.post(API_ENDPOINTS.invitations.decline(invitationId));

  if (!response.success) {
    throw new Error(response.error?.message || 'Error al rechazar la invitación');
  }
}
