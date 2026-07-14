import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

import { AuthBrand } from './AuthBrand';

interface LayoutShellProps {
  nav: ReactNode;
  maxWidth?: 'content' | 'app';
  headerVariant?: 'blur' | 'solid';
  mainClassName?: string;
  suspendOutlet?: boolean;
}

export function LayoutShell({
  nav,
  maxWidth = 'content',
  headerVariant = 'solid',
  mainClassName,
  suspendOutlet = false,
}: LayoutShellProps) {
  const outlet = suspendOutlet ? (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  ) : (
    <Outlet />
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={cn(
          'border-b border-border',
          headerVariant === 'blur' ? 'bg-card/80 backdrop-blur-sm' : 'bg-card',
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-header items-center justify-between px-page',
            maxWidth === 'app' ? 'max-w-app' : 'max-w-content',
          )}
        >
          <AuthBrand />
          <div className="flex items-center gap-stack-sm">
            <ThemeToggle />
            {nav}
          </div>
        </div>
      </header>

      <main className={cn('flex-1', mainClassName)}>
        {outlet}
      </main>
    </div>
  );
}
