import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  as: Component = 'div',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </Component>
  );
}
