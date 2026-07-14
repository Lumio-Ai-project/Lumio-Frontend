import { ChevronDown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAvailableChatModules } from '@/hooks/use-chat-modules';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/routes/paths';

interface ChatModuleSelectProps {
  value: string;
  onChange: (moduleId: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatModuleSelect({
  value,
  onChange,
  disabled = false,
  className,
}: ChatModuleSelectProps) {
  const { data: modules = [], isLoading } = useAvailableChatModules();

  if (isLoading && !value) {
    return (
      <span className={cn('text-sm text-muted-foreground', className)}>Loading modules…</span>
    );
  }

  if (modules.length === 0) {
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        <span className="text-sm text-muted-foreground">No modules available</span>
        <Link
          to={ROUTES.DASHBOARD_API_KEYS}
          className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-muted text-foreground hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Add API key"
          title="Add API key"
        >
          <Plus className="size-icon-xs" aria-hidden />
        </Link>
      </div>
    );
  }

  const selectedModule = modules.find((module) => module.id === value) ?? modules[0];

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="relative inline-flex items-center">
        <select
          value={value || selectedModule?.id || ''}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled || modules.length <= 1}
          aria-label="Select AI module"
          className={cn(
            'appearance-none p-1 md:p-2 rounded-full border border-border bg-muted text-sm font-medium text-foreground',
            'hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-default disabled:opacity-70',
          )}
        >
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.name}
              {module.isDefault ? ' (default)' : ''}
              {!module.isGlobal ? ' (yours)' : ''}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2 size-icon-xs text-muted-foreground"
          aria-hidden
        />
      </div>
      <Link
        to={ROUTES.DASHBOARD_API_KEYS}
        className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-muted text-foreground hover:bg-muted/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Add API key"
        title="Add API key"
      >
        <Plus className="size-icon-xs" aria-hidden />
      </Link>
    </div>
  );
}
