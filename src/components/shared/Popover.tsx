import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

function usePopoverContext(component: string) {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error(`${component} must be used within Popover`);
  }
  return context;
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as React.RefObject<T | null>).current = node;
      }
    }
  };
}

function mergeHandlers(
  theirs: React.MouseEventHandler<HTMLButtonElement> | undefined,
  ours: React.MouseEventHandler<HTMLButtonElement>,
) {
  return (event: React.MouseEvent<HTMLButtonElement>) => {
    theirs?.(event);
    if (!event.defaultPrevented) {
      ours(event);
    }
  };
}

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function PopoverRoot({ children, open, defaultOpen = false, onOpenChange }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const titleId = React.useId();
  const descriptionId = React.useId();

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleOpenChange, isOpen]);

  const value = React.useMemo(
    () => ({
      open: isOpen,
      onOpenChange: handleOpenChange,
      titleId,
      descriptionId,
    }),
    [descriptionId, handleOpenChange, isOpen, titleId],
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild = false, children, className, onClick, ...props }, ref) => {
    const { onOpenChange } = usePopoverContext('Popover.Trigger');

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(true);
      onClick?.(event);
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.ButtonHTMLAttributes<HTMLButtonElement> & {
          ref?: React.Ref<HTMLButtonElement>;
        }
      >;

      return React.cloneElement(child, {
        ...props,
        className: cn(child.props.className, className),
        onClick: mergeHandlers(child.props.onClick, handleOpen),
        ref: mergeRefs(ref, child.props.ref),
      } as React.ComponentPropsWithRef<'button'>);
    }

    return (
      <button
        ref={ref}
        type="button"
        className={className}
        onClick={handleOpen}
        {...props}
      >
        {children}
      </button>
    );
  },
);
PopoverTrigger.displayName = 'PopoverTrigger';

function PopoverPortal({ children }: { children: React.ReactNode }) {
  const { open } = usePopoverContext('Popover.Portal');

  if (!open) {
    return null;
  }

  return createPortal(children, document.body);
}

const PopoverOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = usePopoverContext('Popover.Overlay');

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-overlay bg-black/50 backdrop-blur-[2px] transition-opacity duration-normal',
          className,
        )}
        aria-hidden
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            onOpenChange(false);
          }
        }}
        {...props}
      />
    );
  },
);
PopoverOverlay.displayName = 'PopoverOverlay';

const popoverContentVariants = cva(
  'fixed left-1/2 top-1/2 w-[90%] md:w-[48rem] z-modal flex max-h-[min(90vh,48rem)] -translate-x-1/2  -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg outline-none transition-all duration-normal',
  {
    variants: {
      size: {
        sm: 'w-full',
        md: 'w-[48rem]',
        half: '',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
);

interface PopoverContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof popoverContentVariants> {}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, size, children, onClick, ...props }, ref) => {
    const { titleId, descriptionId } = usePopoverContext('Popover.Content');
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement);

    React.useEffect(() => {
      const node = contentRef.current;
      if (!node) {
        return;
      }

      const focusable = node.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }, []);

    return (
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(popoverContentVariants({ size }), className)}
        onClick={(event) => {
          event.stopPropagation();
          onClick?.(event);
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
PopoverContent.displayName = 'PopoverContent';

const PopoverHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-stack-sm border-b border-border p-card', className)}
      {...props}
    />
  ),
);
PopoverHeader.displayName = 'PopoverHeader';

const PopoverTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const { titleId } = usePopoverContext('Popover.Title');

    return (
      <h2
        ref={ref}
        id={titleId}
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
      />
    );
  },
);
PopoverTitle.displayName = 'PopoverTitle';

const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { descriptionId } = usePopoverContext('Popover.Description');

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
PopoverDescription.displayName = 'PopoverDescription';

const PopoverBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 overflow-y-auto p-card', className)} {...props} />
  ),
);
PopoverBody.displayName = 'PopoverBody';

const PopoverFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-wrap items-center justify-end gap-stack-sm border-t border-border p-card',
        className,
      )}
      {...props}
    />
  ),
);
PopoverFooter.displayName = 'PopoverFooter';

interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ asChild = false, children, className, onClick, ...props }, ref) => {
    const { onOpenChange } = usePopoverContext('Popover.Close');

    const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
      onOpenChange(false);
      onClick?.(event);
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<
        React.ButtonHTMLAttributes<HTMLButtonElement> & {
          ref?: React.Ref<HTMLButtonElement>;
        }
      >;

      return React.cloneElement(child, {
        ...props,
        className: cn(child.props.className, className),
        onClick: mergeHandlers(child.props.onClick, handleClose),
        ref: mergeRefs(ref, child.props.ref),
      } as React.ComponentPropsWithRef<'button'>);
    }

    return (
      <button ref={ref} type="button" className={className} onClick={handleClose} {...props}>
        {children}
      </button>
    );
  },
);
PopoverClose.displayName = 'PopoverClose';

const PopoverCloseIcon = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <PopoverClose
      ref={ref}
      className={cn(
        'absolute right-4 top-4 cursor-pointer rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      aria-label="Close"
      {...props}
    >
      <X className="size-icon-sm" aria-hidden />
    </PopoverClose>
  ),
);
PopoverCloseIcon.displayName = 'PopoverCloseIcon';

const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Overlay: PopoverOverlay,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Body: PopoverBody,
  Footer: PopoverFooter,
  Close: PopoverClose,
  CloseIcon: PopoverCloseIcon,
});

export {
  Popover,
  PopoverBody,
  PopoverClose,
  PopoverCloseIcon,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverOverlay,
  PopoverPortal,
  PopoverTitle,
  PopoverTrigger,
  popoverContentVariants,
};
