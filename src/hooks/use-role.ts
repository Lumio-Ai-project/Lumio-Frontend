import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/constants/roles';

export function hasAnyRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export function useRole() {
  const { user } = useAuth();
  const role = user?.role ?? null;

  return {
    role,
    isAdmin: role === 'admin',
    isModerator: role === 'moderator',
    isGuest: role === 'guest',
    hasRole: (allowed: UserRole[]) => (role ? hasAnyRole(role, allowed) : false),
  };
}
