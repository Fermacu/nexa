import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import * as companyController from '../controllers/companyController';
import { authenticate } from '../middleware/auth';
import { ValidationError } from '../utils/errors';

const router = Router();

// All company routes require authentication
router.use(authenticate);

// Validation for company creation
const createCompanyValidation = [
  body('name').trim().isLength({ min: 2, max: 200 }).withMessage('Nombre entre 2 y 200 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Correo de empresa válido requerido'),
  body('phone').trim().notEmpty().withMessage('Teléfono de empresa requerido'),
  body('address').isObject().withMessage('address is required'),
  body('address.street').trim().isLength({ min: 3, max: 200 }).withMessage('Dirección entre 3 y 200 caracteres'),
  body('address.city').trim().isLength({ min: 2, max: 100 }).withMessage('Ciudad entre 2 y 100 caracteres'),
  body('address.state').trim().isLength({ min: 2, max: 100 }).withMessage('Estado entre 2 y 100 caracteres'),
  body('address.postalCode').trim().isLength({ min: 3, max: 20 }).withMessage('Código postal entre 3 y 20 caracteres'),
  body('address.country').trim().notEmpty().withMessage('País requerido'),
  body('website').optional().isURL().withMessage('URL de sitio web válida'),
  body('industry').optional().trim(),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Descripción máximo 500 caracteres'),
];

// Validation for company update
const updateCompanyValidation = [
  body('name').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Nombre entre 2 y 200 caracteres'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Correo de empresa válido requerido'),
  body('phone').optional().trim(),
  body('address').optional().isObject().withMessage('address debe ser un objeto'),
  body('address.street').optional().trim().isLength({ min: 3, max: 200 }),
  body('address.city').optional().trim().isLength({ min: 2, max: 100 }),
  body('address.state').optional().trim().isLength({ min: 2, max: 100 }),
  body('address.postalCode').optional().trim().isLength({ min: 3, max: 20 }),
  body('address.country').optional().trim().notEmpty(),
  body('website').optional().isURL().withMessage('URL de sitio web válida'),
  body('industry').optional().trim(),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Descripción máximo 500 caracteres'),
];

// POST /api/companies - Create a new company
router.post(
  '/',
  createCompanyValidation,
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
  companyController.createCompanyController
);

// GET /api/companies/:id - Get company by ID
router.get('/:id', companyController.getCompany);

// PUT /api/companies/:id - Update company
router.put(
  '/:id',
  updateCompanyValidation,
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
  companyController.updateCompanyController
);

export const companyRoutes = router;
