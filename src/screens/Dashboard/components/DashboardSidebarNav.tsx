import { FileText, Key, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { useRole } from '@/hooks/use-role';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/paths';

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-stack-sm rounded-md px-3 py-2 text-sm transition-colors duration-normal',
    isActive
      ? 'bg-accent font-medium text-accent-foreground'
      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
  );

export function DashboardSidebarNav() {
  const { isAdmin, isModerator } = useRole();

  return (
    <nav className="flex flex-col gap-1 px-3 py-2">
      {isAdmin ? (
        <NavLink to={ROUTES.DASHBOARD_USERS} className={sidebarLinkClass}>
          <Users className="size-icon-sm shrink-0" aria-hidden />
          Users
        </NavLink>
      ) : null}
      <NavLink to={ROUTES.DASHBOARD_API_KEYS} className={sidebarLinkClass}>
        <Key className="size-icon-sm shrink-0" aria-hidden />
        API Keys
      </NavLink>
      {isAdmin || isModerator ? (
        <NavLink to={ROUTES.DASHBOARD_TEMPLATES} className={sidebarLinkClass}>
          <FileText className="size-icon-sm shrink-0" aria-hidden />
          Templates
        </NavLink>
      ) : null}
    </nav>
  );
}
