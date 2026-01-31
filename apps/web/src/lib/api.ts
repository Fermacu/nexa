/**
 * API client for the NEXA backend.
 * Uses NEXT_PUBLIC_API_URL for the base URL and optionally an auth token.
 */

const getBaseUrl = (): string => {
  const url = (process.env.NEXT_PUBLIC_API_URL || '').trim()
  return url || 'http://localhost:3001'
}

export interface ApiErrorResponse {
  success: false
  error: {
    message: string
    code?: string
    errors?: Record<string, string>
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }

  let res: Response
  try {
    res = await fetch(url, { ...fetchOptions, headers })
  } catch (networkError: unknown) {
    const message =
      networkError instanceof TypeError && networkError.message === 'Failed to fetch'
        ? 'No se pudo conectar al servidor. ¿Está corriendo el API en ' + baseUrl + '?'
        : (networkError as Error)?.message || 'Error de red'
    const err = new Error(message) as Error & {
      response?: { data?: ApiErrorResponse; status: number }
    }
    err.response = { status: 0 }
    throw err
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error((data as ApiErrorResponse).error?.message || res.statusText) as Error & {
      response?: { data?: ApiErrorResponse; status: number }
    }
    err.response = { data: data as ApiErrorResponse, status: res.status }
    throw err
  }
  return data as T
}

export async function registerUser(
  body: {
    user: { name: string; email: string; password: string; phone?: string }
    company: {
      name: string
      email: string
      phone: string
      address: { street: string; city: string; state: string; postalCode: string; country: string }
      website?: string
      industry?: string
      description?: string
    }
  },
  token?: string | null
) {
  return apiRequest<{ success: true; data: { uid: string; email: string; message: string }; message?: string }>(
    '/api/auth/register',
    { method: 'POST', body: JSON.stringify(body), token }
  )
}
