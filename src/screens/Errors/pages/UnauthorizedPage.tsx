import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { getHomeRouteForRole } from '@/routes/paths';
import unauthorizedImage from '@/assets/undraw_data-thief_d66l.svg';

export function UnauthorizedPage() {
  const { user } = useAuth();
  const homeRoute = getHomeRouteForRole(user?.role);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={unauthorizedImage}  alt="Unauthorized" className="w-1/2 h-1/2 " />
      <p className="mt-8 text-muted-foreground ">You don&apos;t have permission to access this page.</p>
      <Link to={homeRoute} className="mt-card">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
