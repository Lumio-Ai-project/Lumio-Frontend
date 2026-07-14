import { ROUTES } from '@/routes/paths';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export function getGoogleRedirectUri(): string {
  return import.meta.env.VITE_GOOGLE_REDIRECT_URI ?? `${window.location.origin}${ROUTES.GOOGLE_CALLBACK}`;
}

export function startGoogleSignIn(): void {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error('Google client ID is not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });

  window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
}
