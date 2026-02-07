import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { ValidationError } from '../utils/errors';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Validation for user update
const updateUserValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nombre entre 2 y 100 caracteres'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Correo electrónico válido requerido'),
  body('phone').optional().trim(),
];

// GET /api/users/me - Get current user
router.get('/me', userController.getCurrentUser);

// PUT /api/users/me - Update current user
router.put(
  '/me',
  updateUserValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const fieldErrors: Record<string, string> = {};
      errors.array().forEach((err) => {
        const path = err.path || err.param;
        if (path) {
          fieldErrors[path] = err.msg;
        }
      });
      throw new ValidationError('Error de validación', fieldErrors);
    }
    next();
  },
  userController.updateCurrentUser
);

// GET /api/users/me/companies - Get current user's companies
router.get('/me/companies', userController.getCurrentUserCompanies);

// GET /api/users/me/notifications - Get current user's notifications
router.get('/me/notifications', userController.getMyNotifications);

// GET /api/users/me/notifications/unread-count - Get unread count
router.get('/me/notifications/unread-count', userController.getMyUnreadCount);

export const userRoutes = router;
