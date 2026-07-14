import type { UserRole } from '@/constants/roles';

export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
  CHAT_CONVERSATION: '/chat/:chatId',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  GOOGLE_CALLBACK: '/auth/google/callback',
  DASHBOARD: '/dashboard',
  DASHBOARD_USERS: '/dashboard/users',
  DASHBOARD_API_KEYS: '/dashboard/api-keys',
  DASHBOARD_TEMPLATES: '/dashboard/templates',
  DASHBOARD_TEMPLATE_DETAIL: '/dashboard/templates/:id',
  UNAUTHORIZED: '/403',
  NOT_FOUND: '/404',
} as const;

export function getChatConversationPath(chatId: string): string {
  return `/chat/${chatId}`;
}

export function getHomeRouteForRole(role: UserRole | null | undefined): string {
  if (role === 'admin' || role === 'moderator') {
    return ROUTES.DASHBOARD;
  }
  return ROUTES.CHAT;
}
