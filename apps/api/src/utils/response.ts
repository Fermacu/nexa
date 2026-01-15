import { Response } from 'express'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    message: string
    code?: string
    errors?: Record<string, string>
  }
}

export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode: number = 200) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  }
  return res.status(statusCode).json(response)
}

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  errors?: Record<string, string>
) => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      ...(code && { code }),
      ...(errors && { errors }),
    },
  }
  return res.status(statusCode).json(response)
}