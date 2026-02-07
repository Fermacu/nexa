import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getUserByUid, updateUser, getUserCompanies } from '../services/userService';
import { getNotificationsByUserId, getUnreadCount } from '../services/notificationService';
import { sendSuccess } from '../utils/response';

/**
 * GET /api/users/me
 * Get current user information
 */
export async function getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const user = await getUserByUid(req.user.uid);
  return sendSuccess(res, user);
}

/**
 * PUT /api/users/me
 * Update current user information
 */
export async function updateCurrentUser(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const user = await updateUser(req.user.uid, req.body);
  return sendSuccess(res, user, 'Información actualizada correctamente');
}

/**
 * GET /api/users/me/companies
 * Get current user's companies
 */
export async function getCurrentUserCompanies(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const companies = await getUserCompanies(req.user.uid);
  return sendSuccess(res, companies);
}

/**
 * GET /api/users/me/notifications
 * Get current user's notifications
 */
export async function getMyNotifications(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const notifications = await getNotificationsByUserId(req.user.uid);
  return sendSuccess(res, notifications);
}

/**
 * GET /api/users/me/notifications/unread-count
 * Get unread notifications count
 */
export async function getMyUnreadCount(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const count = await getUnreadCount(req.user.uid);
  return sendSuccess(res, { count });
}
