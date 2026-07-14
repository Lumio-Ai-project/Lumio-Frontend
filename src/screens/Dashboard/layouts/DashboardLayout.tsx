import { Outlet } from 'react-router-dom';

import { SidebarProvider } from '@/layouts/components/SidebarContext';
import { cn } from '@/lib/utils';

import { DASHBOARD_SIDEBAR_STORAGE_KEY } from '../constants';
import { DashboardSidebar } from '../components/DashboardSidebar';

export function DashboardLayout() {
  return (
    <SidebarProvider storageKey={DASHBOARD_SIDEBAR_STORAGE_KEY}>
      <div className="flex h-full min-h-0 gap-0">
        <DashboardSidebar />
        <div className={cn('min-w-0 flex-1 overflow-auto p-page')}>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
