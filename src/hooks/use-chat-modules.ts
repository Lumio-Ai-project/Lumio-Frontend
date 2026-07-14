import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { chatModuleKeys } from '@/api/chat-modules/keys';
import {
  askQuestion,
  createChatModule,
  deleteChatModule,
  fetchAvailableChatModules,
  fetchChatModules,
  setDefaultChatModule,
  updateChatModule,
} from '@/api/chat-modules/mutations';
import { getGraphQLErrorMessage } from '@/api/graphql-client';
import type {
  AskQuestionInput,
  CreateChatModuleInput,
  UpdateChatModuleInput,
} from '@/types/chat-module';

export function useChatModules() {
  return useQuery({
    queryKey: chatModuleKeys.list(),
    queryFn: fetchChatModules,
  });
}

export function useAvailableChatModules() {
  return useQuery({
    queryKey: chatModuleKeys.available(),
    queryFn: fetchAvailableChatModules,
  });
}

export function useCreateChatModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateChatModuleInput) => createChatModule(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatModuleKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: chatModuleKeys.available() });
      toast.success('API key module created');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to create API key module'));
    },
  });
}

export function useUpdateChatModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateChatModuleInput) => updateChatModule(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatModuleKeys.all });
      toast.success('API key module updated');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to update API key module'));
    },
  });
}

export function useDeleteChatModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteChatModule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatModuleKeys.all });
      toast.success('API key module deleted');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to delete API key module'));
    },
  });
}

export function useSetDefaultChatModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setDefaultChatModule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatModuleKeys.all });
      toast.success('Default module updated');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to set default module'));
    },
  });
}

export function useAskQuestion() {
  return useMutation({
    mutationFn: (input: AskQuestionInput) => askQuestion(input),
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to get an answer'));
    },
  });
}
