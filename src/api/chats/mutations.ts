import { graphqlRequest } from '@/api/graphql-client';
import type { MessagePayload } from '@/types/auth';
import type {
  Chat,
  CreateChatInput,
  Message,
  SendMessageInput,
  SendMessagePayload,
  UpdateChatInput,
} from '@/types/chat';
import { mapChats, mapMessages, mapSendMessagePayload } from '@/types/chat';

const CHAT_FIELDS = `
  fragment ChatFields on Chat {
    id
    title
    moduleId
    moduleName
    createdAt
    updatedAt
  }
`;

const MESSAGE_FIELDS = `
  fragment MessageFields on Message {
    id
    chatId
    role
    content
    moduleId
    sources {
      source
      title
      url
      publishedAt
    }
    createdAt
  }
`;

export const MY_CHATS_QUERY = `
  ${CHAT_FIELDS}
  query MyChats {
    myChats {
      ...ChatFields
    }
  }
`;

export const CHAT_MESSAGES_QUERY = `
  ${MESSAGE_FIELDS}
  query ChatMessages($chatId: ID!) {
    chatMessages(chatId: $chatId) {
      ...MessageFields
    }
  }
`;

export const CREATE_CHAT_MUTATION = `
  ${CHAT_FIELDS}
  mutation CreateChat($input: CreateChatInput) {
    createChat(input: $input) {
      ...ChatFields
    }
  }
`;

export const SEND_MESSAGE_MUTATION = `
  ${CHAT_FIELDS}
  ${MESSAGE_FIELDS}
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      chat {
        ...ChatFields
      }
      userMessage {
        ...MessageFields
      }
      assistantMessage {
        ...MessageFields
      }
    }
  }
`;

export const UPDATE_CHAT_MUTATION = `
  ${CHAT_FIELDS}
  mutation UpdateChat($input: UpdateChatInput!) {
    updateChat(input: $input) {
      ...ChatFields
    }
  }
`;

export const DELETE_CHAT_MUTATION = `
  mutation DeleteChat($id: ID!) {
    deleteChat(id: $id) {
      success
      message
    }
  }
`;

interface MyChatsResponse {
  myChats: Array<{
    id: string;
    title: string;
    moduleId: string;
    moduleName?: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

interface ChatMessagesResponse {
  chatMessages: Array<{
    id: string;
    chatId: string;
    role: 'USER' | 'ASSISTANT';
    content: string;
    moduleId?: string | null;
    createdAt: string;
  }>;
}

interface CreateChatResponse {
  createChat: MyChatsResponse['myChats'][number];
}

interface SendMessageResponse {
  sendMessage: {
    chat: MyChatsResponse['myChats'][number];
    userMessage: ChatMessagesResponse['chatMessages'][number];
    assistantMessage: ChatMessagesResponse['chatMessages'][number];
  };
}

interface UpdateChatResponse {
  updateChat: MyChatsResponse['myChats'][number];
}

interface DeleteChatResponse {
  deleteChat: MessagePayload;
}

export async function fetchMyChats(): Promise<Chat[]> {
  const data = await graphqlRequest<MyChatsResponse>(MY_CHATS_QUERY);
  return mapChats(data.myChats);
}

export async function fetchChatMessages(chatId: string): Promise<Message[]> {
  const data = await graphqlRequest<ChatMessagesResponse>(CHAT_MESSAGES_QUERY, { chatId });
  return mapMessages(data.chatMessages);
}

export async function createChat(input?: CreateChatInput): Promise<Chat> {
  const data = await graphqlRequest<CreateChatResponse>(CREATE_CHAT_MUTATION, { input });
  return mapChats([data.createChat])[0]!;
}

export async function sendMessage(input: SendMessageInput): Promise<SendMessagePayload> {
  const data = await graphqlRequest<SendMessageResponse>(SEND_MESSAGE_MUTATION, { input });
  return mapSendMessagePayload(data.sendMessage);
}

export async function updateChat(input: UpdateChatInput): Promise<Chat> {
  const data = await graphqlRequest<UpdateChatResponse>(UPDATE_CHAT_MUTATION, { input });
  return mapChats([data.updateChat])[0]!;
}

export async function deleteChat(id: string): Promise<MessagePayload> {
  const data = await graphqlRequest<DeleteChatResponse>(DELETE_CHAT_MUTATION, { id });
  return data.deleteChat;
}
