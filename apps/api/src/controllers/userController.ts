import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getUserByUid, updateUser, getUserCompanies } from '../services/userService';
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
