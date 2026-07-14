import { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuth } from '@/hooks/use-auth';
import { preloadChatPage, preloadDashboardPage } from '@/routes/lazy-pages';
import { ChatTitleInput } from '@/screens/Chat/components/ChatTitleInput';
import { cn } from '@/lib/utils';

import { AppSidebar } from './components/AppSidebar';
import { SidebarProvider } from './components/SidebarContext';

function AppLayoutContent() {
  const { user, logout } = useAuth();

  useEffect(() => {
    preloadChatPage();
    preloadDashboardPage();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        userName={user?.name}
        showDashboard
        dashboardFirst
        onLogout={logout}
      />

      <div className="flex min-w-0 flex-1 flex-col ml-13.75 md:ml-0">
        <header className="flex h-header shrink-0 items-center justify-between gap-stack-sm border-b border-border bg-card px-page">
          <div className="flex min-w-0 flex-1 items-center gap-stack-sm">
            <ChatTitleInput />
          </div>
          <ThemeToggle />
        </header>

        <main className={cn('flex-1 overflow-auto ')}>
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppLayoutContent />
    </SidebarProvider>
  );
}
