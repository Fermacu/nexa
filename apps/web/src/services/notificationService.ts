/**
 * Notification Service
 *
 * Fetches user notifications and unread count.
 */

import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';

export type NotificationType = 'company_invitation';

export interface CompanyInvitationData {
  invitationId: string;
  companyId: string;
  companyName: string;
  role: string;
  inviterName: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  data: CompanyInvitationData | Record<string, unknown>;
}

export interface UnreadCountResponse {
  count: number;
}

/**
 * Get current user's notifications
 */
export async function getNotifications(): Promise<Notification[]> {
  const response = await apiClient.get<Notification[]>(API_ENDPOINTS.users.myNotifications);

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Error al cargar las notificaciones');
  }

  return response.data;
}

/**
 * Get unread notifications count
 */
export async function getUnreadCount(): Promise<number> {
  const response = await apiClient.get<UnreadCountResponse>(
    API_ENDPOINTS.users.myNotificationsUnreadCount
  );

  if (!response.success || response.data === undefined) {
    return 0;
  }

  return response.data.count ?? 0;
}
