import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Loading } from '@/components/shared/Loading';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/routes/paths';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
