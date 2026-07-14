import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/paths';
import { cn } from '@/lib/utils';

interface GuestNavProps {
  className?: string;
}

export function GuestNav({ className }: GuestNavProps) {
  return (
    <nav className={cn('flex items-center gap-stack-sm', className)}>
      <Link to={ROUTES.LOGIN}>
        <Button variant="outline">Log in</Button>
      </Link>
      <Link to={ROUTES.REGISTER}>
        <Button>Sign up</Button>
      </Link>
    </nav>
  );
}
