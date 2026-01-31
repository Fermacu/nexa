import { Request, Response } from 'express'
import { register as registerUser } from '../services/authService'
import { sendSuccess } from '../utils/response'

/**
 * POST /api/auth/register
 * Register a new user with their first company.
 */
export async function register(req: Request, res: Response) {
  const result = await registerUser(req.body)
  return sendSuccess(res, result, result.message, 201)
}
