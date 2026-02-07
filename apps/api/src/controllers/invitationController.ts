import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { acceptInvitation, declineInvitation } from '../services/invitationService';
import { sendSuccess } from '../utils/response';

/**
 * POST /api/invitations/:id/accept
 * Accept a company invitation (invitee only)
 */
export async function acceptInvitationController(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const id = String(req.params.id);
  await acceptInvitation(id, req.user.uid);
  return sendSuccess(res, { accepted: true }, 'Invitación aceptada. Ya eres miembro de la organización.');
}

/**
 * POST /api/invitations/:id/decline
 * Decline a company invitation (invitee only)
 */
export async function declineInvitationController(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  if (!req.user?.uid) {
    throw new Error('User not authenticated');
  }

  const id = String(req.params.id);
  await declineInvitation(id, req.user.uid);
  return sendSuccess(res, { declined: true }, 'Invitación rechazada.');
}
