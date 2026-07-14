const AUTH_STORAGE_KEY = 'lumio:auth:v1';

interface AuthStorage {
  accessToken: string;
  expiresAt: number;
}

export function saveAuth(accessToken: string, expiresInSeconds: number): void {
  try {
    const payload: AuthStorage = {
      accessToken,
      expiresAt: Date.now() + expiresInSeconds * 1000,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // private mode / quota
  }
}

export function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const data = JSON.parse(raw) as AuthStorage;
    if (Date.now() >= data.expiresAt) {
      clearAuthStorage();
      return null;
    }

    return data.accessToken;
  } catch {
    return null;
  }
}

export function clearAuthStorage(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}
