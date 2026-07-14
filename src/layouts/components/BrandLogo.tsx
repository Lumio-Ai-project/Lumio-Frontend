import { cn } from '@/lib/utils';

export const LOGO_SRC = '/logo.png';

const sizeClasses = {
  sm: 'h-7',
  md: 'h-9',
  lg: 'h-11',
} as const;

interface BrandLogoProps {
  size?: keyof typeof sizeClasses;
  className?: string;
}

export function BrandLogo({ size = 'md', className }: BrandLogoProps) {
  return (
    <img
      src={LOGO_SRC}
      alt="Lumio"
      className={cn('w-auto object-contain', sizeClasses[size], className)}
    />
  );
}
