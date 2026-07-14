import { createContext, useContext } from 'react';

import { useMe } from '@/hooks/use-me';
import { useLogin, useLogout, useRegister } from '@/hooks/use-auth-mutations';
import { clearAuthStorage, getAccessToken } from '@/lib/auth-storage';
import type { LoginInput, RegisterInput, User } from '@/types/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hasToken = Boolean(getAccessToken());
  const { data: user, isPending } = useMe();
  const resolvedUser = user ?? null;
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (input: LoginInput) => {
    const data = await loginMutation.mutateAsync(input);
    return data.user;
  };

  const register = async (input: RegisterInput) => {
    const data = await registerMutation.mutateAsync(input);
    return data.user;
  };

  const logout = () => {
    clearAuthStorage();
    logoutMutation.mutate();
    window.location.href = '/login';
  };

  const value: AuthContextValue = {
    user: resolvedUser,
    isAuthenticated: hasToken && Boolean(resolvedUser),
    isLoading: hasToken && isPending,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
