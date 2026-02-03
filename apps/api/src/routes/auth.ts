import express, { Router } from 'express'
import { body, validationResult } from 'express-validator'
import * as authController from '../controllers/authController'
import { ValidationError } from '../utils/errors'

const router = Router()

const registerValidation = [
  body('user').isObject().withMessage('user is required'),
  body('user.name').trim().isLength({ min: 2, max: 100 }).withMessage('Nombre entre 2 y 100 caracteres'),
  body('user.email').isEmail().normalizeEmail().withMessage('Correo electrónico válido requerido'),
  body('user.password').isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres'),
  body('user.phone').optional().trim(),
  body('company').isObject().withMessage('company is required'),
  body('company.name').trim().isLength({ min: 2, max: 200 }).withMessage('Nombre de empresa entre 2 y 200 caracteres'),
  body('company.email').isEmail().normalizeEmail().withMessage('Correo de empresa válido requerido'),
  body('company.phone').trim().notEmpty().withMessage('Teléfono de empresa requerido'),
  body('company.address').isObject().withMessage('address is required'),
  body('company.address.street').trim().isLength({ min: 3, max: 200 }).withMessage('Dirección entre 3 y 200 caracteres'),
  body('company.address.city').trim().isLength({ min: 2, max: 100 }).withMessage('Ciudad entre 2 y 100 caracteres'),
  body('company.address.state').trim().isLength({ min: 2, max: 100 }).withMessage('Estado entre 2 y 100 caracteres'),
  body('company.address.postalCode').trim().isLength({ min: 3, max: 20 }).withMessage('Código postal entre 3 y 20 caracteres'),
  body('company.address.country').trim().notEmpty().withMessage('País requerido'),
  body('company.website').optional().isURL().withMessage('URL de sitio web válida'),
  body('company.industry').optional().trim(),
  body('company.description').optional().trim().isLength({ max: 500 }).withMessage('Descripción máximo 500 caracteres'),
]

// Map API field paths to frontend form field names
const fieldPathToFormName: Record<string, string> = {
  'user.name': 'userName',
  'user.email': 'userEmail',
  'user.password': 'userPassword',
  'user.phone': 'userPhone',
  'company.name': 'companyName',
  'company.email': 'companyEmail',
  'company.phone': 'companyPhone',
  'company.address.street': 'street',
  'company.address.city': 'city',
  'company.address.state': 'state',
  'company.address.postalCode': 'postalCode',
  'company.address.country': 'country',
  'company.website': 'website',
  'company.industry': 'industry',
  'company.description': 'description',
}

router.post('/register', registerValidation, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const fieldErrors: Record<string, string> = {}
    errors.array().forEach((err: any) => {
      const path = err.path || err.param
      if (path) {
        const formName = fieldPathToFormName[path] ?? path
        fieldErrors[formName] = err.msg
      }
    })
    throw new ValidationError('Error de validación', fieldErrors)
  }
  next()
}, authController.register)

export const authRoutes = router
