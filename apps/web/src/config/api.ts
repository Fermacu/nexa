/**
 * API Configuration
 * 
 * Centralized configuration for API endpoints and base URL
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  users: {
    me: '/api/users/me',
    myCompanies: '/api/users/me/companies',
    myNotifications: '/api/users/me/notifications',
    myNotificationsUnreadCount: '/api/users/me/notifications/unread-count',
  },
  invitations: {
    accept: (id: string) => `/api/invitations/${id}/accept`,
    decline: (id: string) => `/api/invitations/${id}/decline`,
  },
  companies: {
    create: '/api/companies',
    byId: (id: string) => `/api/companies/${id}`,
    members: (id: string) => `/api/companies/${id}/members`,
  },
} as const;
