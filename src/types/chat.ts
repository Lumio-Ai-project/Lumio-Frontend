import type { SourceCitation } from '@/types/source-citation';

export type MessageRole = 'USER' | 'ASSISTANT';

export interface Chat {
  id: string;
  title: string;
  moduleId: string;
  moduleName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  moduleId: string | null;
  sources: SourceCitation[] | null;
  createdAt: string;
}

export interface CreateChatInput {
  moduleId?: string;
  title?: string;
}

export interface SendMessageInput {
  chatId?: string;
  content: string;
  moduleId?: string;
}

export interface UpdateChatInput {
  id: string;
  title?: string;
}

export interface SendMessagePayload {
  chat: Chat;
  userMessage: Message;
  assistantMessage: Message;
}

function mapChat(raw: {
  id: string;
  title: string;
  moduleId: string;
  moduleName?: string | null;
  createdAt: string;
  updatedAt: string;
}): Chat {
  return {
    id: raw.id,
    title: raw.title,
    moduleId: raw.moduleId,
    moduleName: raw.moduleName ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function mapMessage(raw: {
  id: string;
  chatId: string;
  role: MessageRole;
  content: string;
  moduleId?: string | null;
  sources?: SourceCitation[] | null;
  createdAt: string;
}): Message {
  return {
    id: raw.id,
    chatId: raw.chatId,
    role: raw.role,
    content: raw.content,
    moduleId: raw.moduleId ?? null,
    sources: raw.sources ?? null,
    createdAt: raw.createdAt,
  };
}

export function mapChats(
  items: Array<{
    id: string;
    title: string;
    moduleId: string;
    moduleName?: string | null;
    createdAt: string;
    updatedAt: string;
  }>,
): Chat[] {
  return items.map(mapChat);
}

export function mapMessages(
  items: Array<{
    id: string;
    chatId: string;
    role: MessageRole;
    content: string;
    moduleId?: string | null;
    sources?: SourceCitation[] | null;
    createdAt: string;
  }>,
): Message[] {
  return items.map(mapMessage);
}

export function mapSendMessagePayload(raw: {
  chat: Parameters<typeof mapChat>[0];
  userMessage: Parameters<typeof mapMessage>[0];
  assistantMessage: Parameters<typeof mapMessage>[0];
}): SendMessagePayload {
  return {
    chat: mapChat(raw.chat),
    userMessage: mapMessage(raw.userMessage),
    assistantMessage: mapMessage(raw.assistantMessage),
  };
}
