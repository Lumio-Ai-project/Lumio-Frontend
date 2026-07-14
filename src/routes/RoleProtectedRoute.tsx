import { Navigate, Outlet } from 'react-router-dom';

import { Loading } from '@/components/shared/Loading';
import type { UserRole } from '@/constants/roles';
import { useAuth } from '@/hooks/use-auth';
import { hasAnyRole } from '@/hooks/use-role';
import { ROUTES } from '@/routes/paths';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user || !hasAnyRole(user.role, allowedRoles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
}
