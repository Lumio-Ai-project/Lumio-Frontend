import { clearAuthStorage, getAccessToken } from '@/lib/auth-storage';
import type { Chat, Message, SendMessageInput, SendMessagePayload } from '@/types/chat';

const graphqlEndpoint = import.meta.env.VITE_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

function getApiBaseUrl(): string {
  try {
    const url = new URL(graphqlEndpoint);
    return `${url.protocol}//${url.host}`;
  } catch {
    return 'http://localhost:4000';
  }
}

export type ChatStreamEvent =
  | { type: 'user_message'; chat: Chat; userMessage: Message }
  | { type: 'token'; content: string }
  | {
      type: 'complete';
      chat: Chat;
      userMessage: Message;
      assistantMessage: Message;
    }
  | { type: 'error'; message: string };

export interface StreamSendMessageHandlers {
  onEvent: (event: ChatStreamEvent) => void;
}

export async function streamSendMessage(
  input: SendMessageInput,
  handlers: StreamSendMessageHandlers,
  signal?: AbortSignal,
): Promise<SendMessagePayload> {
  const token = getAccessToken();
  if (!token) {
    clearAuthStorage();
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  const response = await fetch(`${getApiBaseUrl()}/api/chat/send-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
    signal,
  });

  if (response.status === 401) {
    clearAuthStorage();
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    let message = 'Failed to send message';
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (!response.body) {
    throw new Error('Empty stream response');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completePayload: SendMessagePayload | null = null;

  while (true) {
    let result: ReadableStreamReadResult<Uint8Array>;
    try {
      result = await reader.read();
    } catch (err) {
      if (signal?.aborted) {
        return { chat: null as unknown as Chat, userMessage: null as unknown as Message, assistantMessage: null as unknown as Message };
      }
      throw err;
    }
    const { done, value } = result;
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const line = part
        .split('\n')
        .map((entry) => entry.trim())
        .find((entry) => entry.startsWith('data:'));
      if (!line) {
        continue;
      }

      const payload = line.slice(5).trim();
      if (!payload) {
        continue;
      }

      let event: ChatStreamEvent;
      try {
        event = JSON.parse(payload) as ChatStreamEvent;
      } catch {
        continue;
      }

      handlers.onEvent(event);

      if (event.type === 'error') {
        throw new Error(event.message);
      }

      if (event.type === 'complete') {
        completePayload = {
          chat: event.chat,
          userMessage: event.userMessage,
          assistantMessage: event.assistantMessage,
        };
      }
    }
  }

  if (!completePayload) {
    throw new Error('Stream ended without a complete response');
  }

  return completePayload;
}
