import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { chatKeys } from '@/api/chats/keys';
import {
  createChat,
  deleteChat,
  fetchChatMessages,
  fetchMyChats,
  sendMessage,
  updateChat,
} from '@/api/chats/mutations';
import { getGraphQLErrorMessage } from '@/api/graphql-client';
import type { Chat, CreateChatInput, Message, SendMessageInput, UpdateChatInput } from '@/types/chat';

export function useMyChats(enabled = true) {
  return useQuery({
    queryKey: chatKeys.list(),
    queryFn: fetchMyChats,
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useChatMessages(chatId: string | undefined) {
  return useQuery({
    queryKey: chatKeys.messages(chatId ?? ''),
    queryFn: () => fetchChatMessages(chatId!),
    enabled: Boolean(chatId),
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input?: CreateChatInput) => createChat(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to create chat'));
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SendMessageInput) => sendMessage(input),
    onMutate: async (input) => {
      if (!input.chatId) {
        return undefined;
      }

      const key = chatKeys.messages(input.chatId);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Message[]>(key);
      const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}`,
        chatId: input.chatId,
        role: 'USER',
        content: input.content,
        moduleId: input.moduleId ?? null,
        sources: null,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(key, [...(previous ?? []), optimisticMessage]);

      return { previous, key };
    },
    onSuccess: (payload) => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
      queryClient.setQueryData<Message[]>(chatKeys.messages(payload.chat.id), (current) => {
        const withoutOptimistic = (current ?? []).filter(
          (message) => !message.id.startsWith('optimistic-'),
        );
        const ids = new Set(withoutOptimistic.map((message) => message.id));
        const next = [...withoutOptimistic];

        if (!ids.has(payload.userMessage.id)) {
          next.push(payload.userMessage);
        }
        if (!ids.has(payload.assistantMessage.id)) {
          next.push(payload.assistantMessage);
        }

        return next;
      });
    },
    onError: (error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous);
      }
      toast.error(getGraphQLErrorMessage(error, 'Failed to send message'));
    },
  });
}

export function useUpdateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateChatInput) => updateChat(input),
    onMutate: async (input) => {
      if (!input.title) {
        return undefined;
      }

      await queryClient.cancelQueries({ queryKey: chatKeys.list() });
      const previous = queryClient.getQueryData<Chat[]>(chatKeys.list());
      queryClient.setQueryData<Chat[]>(chatKeys.list(), (current) =>
        (current ?? []).map((chat) =>
          chat.id === input.id ? { ...chat, title: input.title! } : chat,
        ),
      );
      return { previous };
    },
    onSuccess: (updatedChat) => {
      queryClient.setQueryData<Chat[]>(chatKeys.list(), (current) =>
        (current ?? []).map((chat) => (chat.id === updatedChat.id ? updatedChat : chat)),
      );
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(chatKeys.list(), context.previous);
      }
      toast.error(getGraphQLErrorMessage(error, 'Failed to update chat'));
    },
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteChat(id),
    onSuccess: (_payload, id) => {
      queryClient.setQueryData<Chat[]>(chatKeys.list(), (current) =>
        (current ?? []).filter((chat) => chat.id !== id),
      );
      void queryClient.removeQueries({ queryKey: chatKeys.messages(id) });
      toast.success('Chat deleted');
    },
    onError: (error) => {
      toast.error(getGraphQLErrorMessage(error, 'Failed to delete chat'));
    },
  });
}
