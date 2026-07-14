import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Loading } from '@/components/shared/Loading';
import { useLoginWithGoogle } from '@/hooks/use-auth-mutations';
import { getHomeRouteForRole, ROUTES } from '@/routes/paths';
import { AuthCard } from '@/screens/Auth/components/AuthCard';

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const loginWithGoogle = useLoginWithGoogle();
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  const code = searchParams.get('code');
  const oauthError = searchParams.get('error');

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    if (oauthError) {
      setError('Google sign-in was cancelled or failed');
      return;
    }

    if (!code) {
      setError('Missing authorization code from Google');
      return;
    }

    hasStarted.current = true;

    loginWithGoogle
      .mutateAsync({ code })
      .then((data) => {
        navigate(getHomeRouteForRole(data.user.role), { replace: true });
      })
      .catch(() => {
        setError('Google sign-in failed. Please try again.');
      });
  }, [code, oauthError, loginWithGoogle, navigate]);

  if (error) {
    return (
      <AuthCard title="Sign-in failed" description={error}>
        <div className="flex flex-col gap-stack">
          <Link to={ROUTES.LOGIN}>
            <Button className="w-full">Back to login</Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <Loading label="Completing Google sign-in..." />
  );
}
