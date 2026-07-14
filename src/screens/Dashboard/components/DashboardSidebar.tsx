import { cn } from '@/lib/utils';
import { SidebarToggle } from '@/layouts/components/SidebarToggle';
import { useSidebarContext } from '@/layouts/components/SidebarContext';

import { DashboardSidebarNav } from './DashboardSidebarNav';

export function DashboardSidebar() {
  const { isOpen } = useSidebarContext();

  return (
    <>
      <aside
        className={cn(
          'flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-card transition-[width] duration-normal ease-default',
          isOpen ? 'w-sidebar' : 'w-14',
        )}
      >
        <div className={cn('flex h-full flex-col', isOpen ? 'w-sidebar' : 'w-14')}>
          <div
            className={cn(
              'flex h-header shrink-0 items-center border-b border-border',
              isOpen ? 'justify-between gap-stack-sm px-page' : 'justify-center',
            )}
          >
            {isOpen ? (
              <p className="text-sm font-semibold text-foreground">Dashboard</p>
            ) : null}
            <SidebarToggle />
          </div>

          {isOpen ? <DashboardSidebarNav /> : null}
        </div>
      </aside>
    </>
  );
}
