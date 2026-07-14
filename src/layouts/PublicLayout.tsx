import { useAuth } from '@/hooks/use-auth';
import { useRole } from '@/hooks/use-role';

import { AuthenticatedNav } from './components/AuthenticatedNav';
import { GuestNav } from './components/GuestNav';
import { LayoutShell } from './components/LayoutShell';
export function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin, isModerator } = useRole();

  return (
    <LayoutShell
      headerVariant="blur"
      nav={
        isAuthenticated ? (
          <AuthenticatedNav
            userName={user?.name}
            showDashboard={isAdmin || isModerator}
            onLogout={logout}
          />
        ) : (
          <GuestNav />
        )
      }
    />
  );
}
