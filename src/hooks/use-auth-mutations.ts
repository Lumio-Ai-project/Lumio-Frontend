import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  forgotPasswordUser,
  loginUser,
  loginWithGoogleUser,
  logoutUser,
  registerUser,
  resetPasswordUser,
} from '@/api/auth/mutations';
import { authKeys } from '@/api/auth/keys';
import { getGraphQLErrorMessage } from '@/api/graphql-client';
import { saveAuth } from '@/lib/auth-storage';
import type {
  ForgotPasswordInput,
  LoginInput,
  LoginWithGoogleInput,
  RegisterInput,
  ResetPasswordInput,
} from '@/types/auth';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => loginUser(input),
    onSuccess: (data) => {
      saveAuth(data.accessToken, data.expiresIn);
      queryClient.setQueryData(authKeys.me(), data.user);
      toast.success('Welcome back!');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Invalid email or password'));
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => registerUser(input),
    onSuccess: (data) => {
      saveAuth(data.accessToken, data.expiresIn);
      queryClient.setQueryData(authKeys.me(), data.user);
      toast.success('Account created successfully!');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Registration failed'));
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (input: ForgotPasswordInput) => forgotPasswordUser(input),
    onSuccess: () => {
      toast.success('Check your email for reset instructions');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to send reset email'));
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: ResetPasswordInput) => resetPasswordUser(input),
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to reset password'));
    },
  });
}

export function useLoginWithGoogle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginWithGoogleInput) => loginWithGoogleUser(input),
    onSuccess: (data) => {
      saveAuth(data.accessToken, data.expiresIn);
      queryClient.setQueryData(authKeys.me(), data.user);
      toast.success('Signed in with Google!');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Google sign-in failed'));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}
