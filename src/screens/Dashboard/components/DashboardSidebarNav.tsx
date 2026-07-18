import { FileText, Key, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { useRole } from '@/hooks/use-role';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/paths';

const nestedLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-stack-sm rounded-md py-1.5 pl-6 pr-3 text-sm transition-colors duration-normal',
    isActive
      ? 'bg-accent/70 font-medium text-accent-foreground'
      : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
  );

export function DashboardSidebarNav() {
  const { isAdmin, isModerator } = useRole();

  return (
    <div className="mt-1 flex flex-col gap-1">
      {isAdmin ? (
        <NavLink to={ROUTES.DASHBOARD_USERS} className={nestedLinkClass}>
          <Users className="size-icon-sm shrink-0" aria-hidden />
          Users
        </NavLink>
      ) : null}
      <NavLink to={ROUTES.DASHBOARD_API_KEYS} className={nestedLinkClass}>
        <Key className="size-icon-sm shrink-0" aria-hidden />
        API Keys
      </NavLink>
      {isAdmin || isModerator ? (
        <NavLink to={ROUTES.DASHBOARD_TEMPLATES} className={nestedLinkClass}>
          <FileText className="size-icon-sm shrink-0" aria-hidden />
          Templates
        </NavLink>
      ) : null}
    </div>
  );
}
