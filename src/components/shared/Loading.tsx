import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const loadingVariants = cva('flex flex-col items-center justify-center', {
  variants: {
    layout: {
      page: 'min-h-[50vh] w-full',
      inline: 'py-card-sm',
      overlay: 'fixed inset-0 z-overlay bg-background/80 backdrop-blur-sm',
    },
    size: {
      sm: 'gap-stack-sm',
      md: 'gap-stack',
      lg: 'gap-card-sm',
    },
  },
  defaultVariants: {
    layout: 'page',
    size: 'md',
  },
});

const spinnerSizes = {
  sm: 'size-icon-md',
  md: 'size-icon-lg',
  lg: 'size-icon-xl',
} as const;

const labelSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const;

export interface LoadingProps extends VariantProps<typeof loadingVariants> {
  label?: string;
  className?: string;
  hideLabel?: boolean;
}

export function Loading({
  label = '',
  layout,
  size = 'md',
  className,
  hideLabel = false,
}: LoadingProps) {
  const resolvedSize = size ?? 'md';

  return (
    <div
      className={cn(loadingVariants({ layout, size: resolvedSize }), className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className={cn('relative', spinnerSizes[resolvedSize])}>
        <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
        <div className="absolute inset-0 animate-spin rounded-full">
          <div className="size-full rounded-full border-2 border-transparent border-t-primary border-r-primary/50" />
        </div>
        <div className="absolute inset-[28%] animate-pulse rounded-full bg-primary/15" />
      </div>

      {!hideLabel ? (
        <p
          className={cn(
            'font-medium tracking-wide text-muted-foreground',
            labelSizes[resolvedSize],
          )}
        >
          {label}
        </p>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}
