import { Outlet } from 'react-router-dom';

import { cn } from '@/lib/utils';

export function DashboardLayout() {
  return (
    <div className={cn('h-full min-h-0 overflow-auto p-page')}>
      <Outlet />
    </div>
  );
}
