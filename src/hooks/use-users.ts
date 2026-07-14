import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { userKeys } from '@/api/users/keys';
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUserRole,
} from '@/api/users/mutations';
import { getGraphQLErrorMessage } from '@/api/graphql-client';
import type { CreateUserInput, UpdateUserRoleInput } from '@/types/user';

export function useUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: fetchUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to create user'));
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserRoleInput) => updateUserRole(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success('User role updated');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to update user role'));
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success('User deleted');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to delete user'));
    },
  });
}
