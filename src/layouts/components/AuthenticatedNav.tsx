import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/paths';
import { preloadChatPage, preloadDashboardPage } from '@/routes/lazy-pages';
import { cn } from '@/lib/utils';

const navLinkClassName =
  'text-muted-foreground transition-colors duration-normal hover:text-foreground';

interface AuthenticatedNavProps {
  userName?: string;
  showDashboard: boolean;
  dashboardFirst?: boolean;
  onLogout: () => void;
  className?: string;
}

function DashboardLink() {
  return (
    <Link
      to={ROUTES.DASHBOARD}
      className={navLinkClassName}
      onMouseEnter={preloadDashboardPage}
      onFocus={preloadDashboardPage}
    >
      Dashboard
    </Link>
  );
}

function ChatLink() {
  return (
    <Link
      to={ROUTES.CHAT}
      className={navLinkClassName}
      onMouseEnter={preloadChatPage}
      onFocus={preloadChatPage}
    >
      Chat
    </Link>
  );
}

export function AuthenticatedNav({
  userName,
  showDashboard,
  dashboardFirst = false,
  onLogout,
  className,
}: AuthenticatedNavProps) {
  const dashboard = showDashboard ? <DashboardLink /> : null;

  return (
    <nav className={cn('flex items-center gap-stack text-sm', className)}>
      {dashboardFirst ? (
        <>
          {dashboard}
          <ChatLink />
        </>
      ) : (
        <>
          <ChatLink />
          {dashboard}
        </>
      )}
      <span className="hidden text-muted-foreground sm:inline">{userName}</span>
      <Button variant="outline" onClick={onLogout}>
        Log out
      </Button>
    </nav>
  );
}
