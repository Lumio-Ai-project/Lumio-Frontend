import { LOGO_SRC } from '@/layouts/components/BrandLogo';
import { cn } from '@/lib/utils';

export function AssistantTypingIndicator() {



  return (
    <div
      className="flex animate-fade-in justify-start gap-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Assistant is responding"
    >
      <div className="relative flex size-8 shrink-0 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 animate-chat-glow rounded-full bg-linear-to-br from-brand-purple/40 via-brand-blue/40 to-brand-cyan/40 blur-md"
        />
        <span
          aria-hidden
          className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-background"
        >
          <img
            src={LOGO_SRC}
            alt=""
            aria-hidden
            className="size-7 object-contain"
          />
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 pt-0.5">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted/80 px-4 py-3.5 shadow-xs backdrop-blur-sm">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-chat-shimmer bg-linear-to-r from-transparent via-primary/10 to-transparent"
          />

          <div className="relative flex items-center gap-1.5">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                aria-hidden
                className={cn(
                  'size-2 rounded-full bg-brand-gradient animate-chat-typing-bounce',
                  index === 1 && '[animation-delay:160ms]',
                  index === 2 && '[animation-delay:320ms]',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
