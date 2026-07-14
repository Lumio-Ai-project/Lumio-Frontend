import { graphqlRequest } from '@/api/graphql-client';
import type {
  AskQuestionAnswer,
  AskQuestionInput,
  ChatModule,
  ChatModuleOption,
  CreateChatModuleInput,
  UpdateChatModuleInput,
} from '@/types/chat-module';
import { mapChatModuleOptions, mapChatModules } from '@/types/chat-module';
import type { MessagePayload } from '@/types/auth';

const CHAT_MODULE_FIELDS = `
  fragment ChatModuleFields on ChatModule {
    id
    name
    slug
    description
    provider
    model
    isActive
    isDefault
    isGlobal
    hasApiKey
    maskedApiKey
    apiKey
    createdAt
  }
`;

const CHAT_MODULE_OPTION_FIELDS = `
  fragment ChatModuleOptionFields on ChatModuleOption {
    id
    name
    description
    provider
    model
    isDefault
    isGlobal
  }
`;

export const CHAT_MODULES_QUERY = `
  ${CHAT_MODULE_FIELDS}
  query ChatModules {
    chatModules {
      ...ChatModuleFields
    }
  }
`;

export const AVAILABLE_CHAT_MODULES_QUERY = `
  ${CHAT_MODULE_OPTION_FIELDS}
  query AvailableChatModules {
    availableChatModules {
      ...ChatModuleOptionFields
    }
  }
`;

interface ChatModulesResponse {
  chatModules: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    provider: 'GEMINI' | 'OPENROUTER';
    model: string;
    isActive: boolean;
    isDefault: boolean;
    isGlobal?: boolean;
    hasApiKey: boolean;
    maskedApiKey?: string | null;
    apiKey?: string | null;
    createdAt: string;
  }>;
}

interface AvailableChatModulesResponse {
  availableChatModules: Array<{
    id: string;
    name: string;
    description?: string | null;
    provider: 'GEMINI' | 'OPENROUTER';
    model: string;
    isDefault: boolean;
    isGlobal?: boolean;
  }>;
}

export async function fetchChatModules(): Promise<ChatModule[]> {
  const data = await graphqlRequest<ChatModulesResponse>(CHAT_MODULES_QUERY);
  return mapChatModules(data.chatModules);
}

export async function fetchAvailableChatModules(): Promise<ChatModuleOption[]> {
  const data = await graphqlRequest<AvailableChatModulesResponse>(AVAILABLE_CHAT_MODULES_QUERY);
  return mapChatModuleOptions(data.availableChatModules);
}

export const CREATE_CHAT_MODULE_MUTATION = `
  ${CHAT_MODULE_FIELDS}
  mutation CreateChatModule($input: CreateChatModuleInput!) {
    createChatModule(input: $input) {
      ...ChatModuleFields
    }
  }
`;

export const UPDATE_CHAT_MODULE_MUTATION = `
  ${CHAT_MODULE_FIELDS}
  mutation UpdateChatModule($input: UpdateChatModuleInput!) {
    updateChatModule(input: $input) {
      ...ChatModuleFields
    }
  }
`;

export const DELETE_CHAT_MODULE_MUTATION = `
  mutation DeleteChatModule($id: ID!) {
    deleteChatModule(id: $id) {
      success
      message
    }
  }
`;

export const SET_DEFAULT_CHAT_MODULE_MUTATION = `
  ${CHAT_MODULE_FIELDS}
  mutation SetDefaultChatModule($id: ID!) {
    setDefaultChatModule(id: $id) {
      ...ChatModuleFields
    }
  }
`;

export const ASK_QUESTION_MUTATION = `
  mutation AskQuestion($input: AskQuestionInput!) {
    askQuestion(input: $input) {
      answer
      moduleId
      moduleName
      sources {
        source
        title
        url
        publishedAt
      }
    }
  }
`;

interface CreateChatModuleResponse {
  createChatModule: ChatModulesResponse['chatModules'][number];
}

interface UpdateChatModuleResponse {
  updateChatModule: ChatModulesResponse['chatModules'][number];
}

interface DeleteChatModuleResponse {
  deleteChatModule: MessagePayload;
}

interface SetDefaultChatModuleResponse {
  setDefaultChatModule: ChatModulesResponse['chatModules'][number];
}

interface AskQuestionResponse {
  askQuestion: AskQuestionAnswer;
}

export async function createChatModule(input: CreateChatModuleInput): Promise<ChatModule> {
  const data = await graphqlRequest<CreateChatModuleResponse>(CREATE_CHAT_MODULE_MUTATION, {
    input,
  });
  return mapChatModules([data.createChatModule])[0]!;
}

export async function updateChatModule(input: UpdateChatModuleInput): Promise<ChatModule> {
  const data = await graphqlRequest<UpdateChatModuleResponse>(UPDATE_CHAT_MODULE_MUTATION, {
    input,
  });
  return mapChatModules([data.updateChatModule])[0]!;
}

export async function deleteChatModule(id: string): Promise<MessagePayload> {
  const data = await graphqlRequest<DeleteChatModuleResponse>(DELETE_CHAT_MODULE_MUTATION, { id });
  return data.deleteChatModule;
}

export async function setDefaultChatModule(id: string): Promise<ChatModule> {
  const data = await graphqlRequest<SetDefaultChatModuleResponse>(SET_DEFAULT_CHAT_MODULE_MUTATION, {
    id,
  });
  return mapChatModules([data.setDefaultChatModule])[0]!;
}

export async function askQuestion(input: AskQuestionInput): Promise<AskQuestionAnswer> {
  const data = await graphqlRequest<AskQuestionResponse>(ASK_QUESTION_MUTATION, { input });
  return data.askQuestion;
}
