import { Navigate } from 'react-router-dom';

import { useRole } from '@/hooks/use-role';
import { ROUTES } from '@/routes/paths';

export function DashboardIndexRedirect() {
  const { isAdmin, isModerator } = useRole();

  if (isAdmin) {
    return <Navigate to={ROUTES.DASHBOARD_USERS} replace />;
  }

  if (isModerator) {
    return <Navigate to={ROUTES.DASHBOARD_TEMPLATES} replace />;
  }

  return <Navigate to={ROUTES.DASHBOARD_API_KEYS} replace />;
}
