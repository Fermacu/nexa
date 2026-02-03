/**
 * API Client
 * 
 * Base HTTP client for making API requests to the backend
 */

import { API_BASE_URL } from '../config/api';

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code?: string;
    errors?: Record<string, string>;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Get authentication token from storage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        // Handle error response
        const error: ApiError = {
          message: data.error?.message || 'An error occurred',
          code: data.error?.code,
          errors: data.error?.errors,
        };
        throw error;
      }

      return data;
    } catch (error) {
      // Handle network errors or other exceptions
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
        } as ApiError;
      }

      // Re-throw if it's already an ApiError
      if (error && typeof error === 'object' && 'message' in error) {
        throw error;
      }

      throw {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      } as ApiError;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
