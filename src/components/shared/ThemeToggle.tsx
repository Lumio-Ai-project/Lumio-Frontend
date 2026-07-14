import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border border-border transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isDark ? 'bg-primary' : 'bg-muted',
        className,
      )}
    >
      <span
        className={cn(
          'pointer-events-none flex size-5 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-normal',
          isDark ? 'translate-x-5.5' : 'translate-x-0.5',
        )}
      >
        {isDark ? (
          <Moon className="size-icon-xs text-primary" aria-hidden />
        ) : (
          <Sun className="size-icon-xs text-warning" aria-hidden />
        )}
      </span>
    </button>
  );
}
