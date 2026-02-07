import { Request, Response } from 'express';
import { register, login } from '../services/authService';
import { sendSuccess } from '../utils/response';

/**
 * POST /api/auth/register
 * Register a new user (without organization).
 * Users can create organizations later from their profile.
 */
export async function registerController(req: Request, res: Response): Promise<Response> {
  const result = await register(req.body);
  return sendSuccess(res, result, result.message, 201);
}

/**
 * POST /api/auth/login
 * Login a user with email and password.
 */
export async function loginController(req: Request, res: Response): Promise<Response> {
  const result = await login(req.body);
  return sendSuccess(res, result, result.message, 200);
}
