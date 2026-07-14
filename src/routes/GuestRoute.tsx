import { Navigate, Outlet } from 'react-router-dom';

import { Loading } from '@/components/shared/Loading';
import { useAuth } from '@/hooks/use-auth';
import { getHomeRouteForRole } from '@/routes/paths';

export function GuestRoute() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to={getHomeRouteForRole(user?.role)} replace />;
  }

  return <Outlet />;
}
