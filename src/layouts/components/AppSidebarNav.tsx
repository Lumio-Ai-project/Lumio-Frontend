import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/paths';
import { preloadChatPage, preloadDashboardPage } from '@/routes/lazy-pages';
import { ChatSidebarList } from '@/screens/Chat/components/ChatSidebarList';
import { DashboardSidebarNav } from '@/screens/Dashboard/components/DashboardSidebarNav';
import { cn } from '@/lib/utils';

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-stack-sm rounded-md px-3 py-2 text-sm transition-colors duration-normal',
    isActive
      ? 'bg-accent font-medium text-accent-foreground'
      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
  );

interface AppSidebarNavProps {
  userName?: string;
  showDashboard: boolean;
  dashboardFirst?: boolean;
  onLogout: () => void;
}

function DashboardNavLink() {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname === ROUTES.DASHBOARD ||
    location.pathname.startsWith(`${ROUTES.DASHBOARD}/`);

  return (
    <div className="flex flex-col">
      <NavLink
        to={ROUTES.DASHBOARD}
        className={() => sidebarLinkClass({ isActive: isDashboardRoute })}
        onMouseEnter={preloadDashboardPage}
        onFocus={preloadDashboardPage}
      >
        <LayoutDashboard className="size-icon-sm shrink-0" aria-hidden />
        Dashboard
      </NavLink>
      {isDashboardRoute ? <DashboardSidebarNav /> : null}
    </div>
  );
}

function ChatNavLink() {
  const location = useLocation();
  const isChatRoute =
    location.pathname === ROUTES.CHAT || location.pathname.startsWith(`${ROUTES.CHAT}/`);

  return (
    <div className="flex flex-col">
      <NavLink
        to={ROUTES.CHAT}
        className={() => sidebarLinkClass({ isActive: isChatRoute })}
        onMouseEnter={preloadChatPage}
        onFocus={preloadChatPage}
      >
        <MessageSquare className="size-icon-sm shrink-0" aria-hidden />
        Chat
      </NavLink>
      {isChatRoute ? <ChatSidebarList /> : null}
    </div>
  );
}

export function AppSidebarNav({
  userName,
  showDashboard,
  dashboardFirst = false,
  onLogout,
}: AppSidebarNavProps) {
  const dashboard = showDashboard ? <DashboardNavLink /> : null;

  return (
    <div className="flex h-full flex-col">
      <nav className="flex flex-col gap-1 px-3 py-2">
        {dashboardFirst ? (
          <>
            {dashboard}
            <ChatNavLink />
          </>
        ) : (
          <>
            <ChatNavLink />
            {dashboard}
          </>
        )}
      </nav>

      <div className="mt-auto border-t border-border p-3">
        {userName ? (
          <p className="mb-stack-sm truncate px-3 text-sm text-muted-foreground">{userName}</p>
        ) : null}
        <Button variant="outline" className="w-full" onClick={onLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
}
