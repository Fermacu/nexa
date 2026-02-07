import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import * as authController from '../controllers/authController';
import { ValidationError } from '../utils/errors';

const router = Router();

// Validation for registration (only user information)
const registerValidation = [
  body('user').isObject().withMessage('user is required'),
  body('user.name').trim().isLength({ min: 2, max: 100 }).withMessage('Nombre entre 2 y 100 caracteres'),
  body('user.email').isEmail().normalizeEmail().withMessage('Correo electrónico válido requerido'),
  body('user.password').isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres'),
  body('user.phone').optional().trim(),
];

// Validation for login
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Correo electrónico válido requerido'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
];

// Map API field paths to frontend form field names
const fieldPathToFormName: Record<string, string> = {
  'user.name': 'userName',
  'user.email': 'userEmail',
  'user.password': 'userPassword',
  'user.phone': 'userPhone',
  'email': 'email',
  'password': 'password',
};

// Helper function to format validation errors
function formatValidationErrors(errors: any[]): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  errors.forEach((err) => {
    const path = err.path || err.param;
    if (path) {
      const formName = fieldPathToFormName[path] ?? path;
      fieldErrors[formName] = err.msg;
    }
  });
  return fieldErrors;
}

// Register route
router.post(
  '/register',
  registerValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const fieldErrors = formatValidationErrors(errors.array());
      throw new ValidationError('Error de validación', fieldErrors);
    }
    next();
  },
  authController.registerController
);

// Login route
router.post(
  '/login',
  loginValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const fieldErrors = formatValidationErrors(errors.array());
      throw new ValidationError('Error de validación', fieldErrors);
    }
    next();
  },
  authController.loginController
);

export const authRoutes = router;
