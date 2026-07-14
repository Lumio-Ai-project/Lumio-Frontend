import { PanelLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useSidebarContext } from './SidebarContext';

interface SidebarToggleProps {
  className?: string;
}

export function SidebarToggle({ className }: SidebarToggleProps) {
  const { toggle, isOpen } = useSidebarContext();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      className={cn(
        'inline-flex size-9 cursor-pointer shrink-0 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground transition-colors duration-normal hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <PanelLeft className="size-icon-sm" aria-hidden />
    </button>
  );
}
