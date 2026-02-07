import { Router } from 'express';
import * as invitationController from '../controllers/invitationController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// POST /api/invitations/:id/accept
router.post('/:id/accept', invitationController.acceptInvitationController);

// POST /api/invitations/:id/decline
router.post('/:id/decline', invitationController.declineInvitationController);

export const invitationRoutes = router;
