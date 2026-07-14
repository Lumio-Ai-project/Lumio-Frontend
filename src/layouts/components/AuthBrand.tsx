import { Link } from 'react-router-dom';

import { ROUTES } from '@/routes/paths';
import { cn } from '@/lib/utils';

import { BrandLogo } from './BrandLogo';

interface AuthBrandProps {
  inverted?: boolean;
  className?: string;
}

export function AuthBrand({ inverted = false, className }: AuthBrandProps) {
  return (
    <Link
      to={ROUTES.HOME}
      aria-label="Go to home"
      className={cn(
        'inline-flex shrink-0 transition-opacity duration-normal hover:opacity-80',
        className,
      )}
    >
      <BrandLogo size={inverted ? 'lg' : 'md'} />
    </Link>
  );
}
