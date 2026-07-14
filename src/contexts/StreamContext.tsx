import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { chatKeys } from '@/api/chats/keys';
import { streamSendMessage } from '@/api/chats/stream';
import type { Message, SendMessageInput, SendMessagePayload } from '@/types/chat';

const NEW_CHAT_KEY = '__new__';

interface StreamEntry {
  content: string;
  isPending: boolean;
  abortController: AbortController | null;
}

interface SendStreamOptions {
  onChatCreated?: (chatId: string) => void;
}

interface StreamContextValue {
  send: (input: SendMessageInput, options?: SendStreamOptions) => Promise<SendMessagePayload | null>;
  stop: (chatId: string) => void;
  getStreamState: (chatId: string) => { content: string; isPending: boolean };
  subscribe: (chatId: string, callback: () => void) => () => void;
}

const StreamContext = createContext<StreamContextValue | null>(null);

export function StreamProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const streamsRef = useRef<Map<string, StreamEntry>>(new Map());
  const subscribersRef = useRef<Map<string, Set<() => void>>>(new Map());
  const [version, setVersion] = useState(0);

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const notify = useCallback(
    (chatId: string) => {
      const subs = subscribersRef.current.get(chatId);
      if (subs) {
        for (const cb of subs) {
          cb();
        }
      }
      bump();
    },
    [bump],
  );

  const subscribe = useCallback((chatId: string, callback: () => void) => {
    if (!subscribersRef.current.has(chatId)) {
      subscribersRef.current.set(chatId, new Set());
    }
    subscribersRef.current.get(chatId)!.add(callback);

    return () => {
      const subs = subscribersRef.current.get(chatId);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          subscribersRef.current.delete(chatId);
        }
      }
    };
  }, []);

  const getStreamState = useCallback(
    (chatId: string) => {
      void version;
      const entry = streamsRef.current.get(chatId);
      if (entry) {
        return { content: entry.content, isPending: entry.isPending };
      }
      return { content: '', isPending: false };
    },
    [version],
  );

  const stop = useCallback(
    (chatId: string) => {
      const entry = streamsRef.current.get(chatId);
      if (entry) {
        entry.abortController?.abort();
        streamsRef.current.delete(chatId);
        notify(chatId);
      }
    },
    [notify],
  );

  const send = useCallback(
    async (
      input: SendMessageInput,
      options?: SendStreamOptions,
    ): Promise<SendMessagePayload | null> => {
      const chatId = input.chatId ?? NEW_CHAT_KEY;

      const existing = streamsRef.current.get(chatId);
      if (existing) {
        existing.abortController?.abort();
      }

      const controller = new AbortController();
      const entry: StreamEntry = {
        content: '',
        isPending: true,
        abortController: controller,
      };
      streamsRef.current.set(chatId, entry);
      notify(chatId);

      const key = input.chatId ? chatKeys.messages(input.chatId) : null;
      let previous: Message[] | undefined;

      if (key) {
        await queryClient.cancelQueries({ queryKey: key });
        previous = queryClient.getQueryData<Message[]>(key);
        const optimisticMessage: Message = {
          id: `optimistic-${Date.now()}`,
          chatId: input.chatId!,
          role: 'USER',
          content: input.content,
          moduleId: input.moduleId ?? null,
          sources: null,
          createdAt: new Date().toISOString(),
        };
        queryClient.setQueryData<Message[]>(key, [...(previous ?? []), optimisticMessage]);
      }

      try {
        const payload = await streamSendMessage(
          input,
          {
            onEvent: (event) => {
              if (controller.signal.aborted) {
                return;
              }

              if (event.type === 'user_message') {
                const messageKey = chatKeys.messages(event.chat.id);
                queryClient.setQueryData<Message[]>(messageKey, (current) => {
                  const withoutOptimistic = (current ?? []).filter(
                    (message) => !message.id.startsWith('optimistic-'),
                  );
                  const ids = new Set(withoutOptimistic.map((message) => message.id));
                  if (!ids.has(event.userMessage.id)) {
                    return [...withoutOptimistic, event.userMessage];
                  }
                  return withoutOptimistic;
                });
                void queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

                if (!input.chatId) {
                  options?.onChatCreated?.(event.chat.id);

                  const newEntry = streamsRef.current.get(NEW_CHAT_KEY);
                  streamsRef.current.delete(NEW_CHAT_KEY);
                  if (newEntry) {
                    streamsRef.current.set(event.chat.id, newEntry);
                  }
                  notify(event.chat.id);
                }
              }

              if (event.type === 'token') {
                const current = streamsRef.current.get(
                  input.chatId ?? chatId,
                );
                if (current) {
                  current.content += event.content;
                }
                notify(input.chatId ?? chatId);
              }

              if (event.type === 'complete') {
                const finalChatId = input.chatId ?? chatId;
                queryClient.setQueryData<Message[]>(
                  chatKeys.messages(event.chat.id),
                  (current) => {
                    const withoutOptimistic = (current ?? []).filter(
                      (message) => !message.id.startsWith('optimistic-'),
                    );
                    const ids = new Set(withoutOptimistic.map((message) => message.id));
                    const next = [...withoutOptimistic];
                    if (!ids.has(event.userMessage.id)) {
                      next.push(event.userMessage);
                    }
                    if (!ids.has(event.assistantMessage.id)) {
                      next.push(event.assistantMessage);
                    }
                    return next;
                  },
                );
                void queryClient.invalidateQueries({ queryKey: chatKeys.lists() });

                streamsRef.current.delete(finalChatId);
                notify(finalChatId);
              }
            },
          },
          controller.signal,
        );

        return payload;
      } catch (error) {
        if (controller.signal.aborted) {
          return null;
        }

        if (key && previous) {
          queryClient.setQueryData(key, previous);
        }
        streamsRef.current.delete(chatId);
        notify(chatId);
        toast.error(error instanceof Error ? error.message : 'Failed to send message');
        throw error;
      }
    },
    [queryClient, notify],
  );

  const value: StreamContextValue = {
    send,
    stop,
    getStreamState,
    subscribe,
  };

  return <StreamContext.Provider value={value}>{children}</StreamContext.Provider>;
}

export function useChatStream(chatId?: string) {
  const ctx = useContext(StreamContext);
  if (!ctx) {
    throw new Error('useChatStream must be used within StreamProvider');
  }

  const streamKey = chatId ?? NEW_CHAT_KEY;
  const [, setTick] = useState(0);

  useEffect(() => {
    return ctx.subscribe(streamKey, () => setTick((t) => t + 1));
  }, [ctx, streamKey]);

  const state = ctx.getStreamState(streamKey);

  const send = useCallback(
    async (
      input: SendMessageInput,
      options?: SendStreamOptions,
    ): Promise<SendMessagePayload | null> => {
      return ctx.send(input, options);
    },
    [ctx],
  );

  const stop = useCallback(() => {
    ctx.stop(streamKey);
  }, [ctx, streamKey]);

  return {
    send,
    stop,
    isPending: state.isPending,
    streamingContent: state.content,
  };
}
