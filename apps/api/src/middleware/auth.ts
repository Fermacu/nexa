import { Request, Response, NextFunction } from 'express'
import { auth } from '../config/firebase'
import { UnauthorizedError } from '../utils/errors'
import { AuthenticatedRequest } from '../types'

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided')
    }

    const token = authHeader.split('Bearer ')[1]

    const decodedToken = await auth.verifyIdToken(token)
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    }

    next()
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      return next(new UnauthorizedError('Token expired'))
    }
    if (error.code === 'auth/argument-error') {
      return next(new UnauthorizedError('Invalid token'))
    }
    return next(new UnauthorizedError('Authentication failed'))
  }
}