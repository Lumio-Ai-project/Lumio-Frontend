import type { SourceCitation } from '@/types/source-citation';

export type AiProvider = 'GEMINI' | 'OPENROUTER';

export interface ChatModule {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  provider: AiProvider;
  model: string;
  isActive: boolean;
  isDefault: boolean;
  isGlobal: boolean;
  hasApiKey: boolean;
  maskedApiKey: string | null;
  apiKey: string | null;
  createdAt: string;
}

export interface ChatModuleOption {
  id: string;
  name: string;
  description: string | null;
  provider: AiProvider;
  model: string;
  isDefault: boolean;
  isGlobal: boolean;
}

export interface CreateChatModuleInput {
  name: string;
  slug?: string;
  description?: string | null;
  provider: AiProvider;
  model: string;
  apiKey: string;
  isActive?: boolean;
  isDefault?: boolean;
  isGlobal?: boolean;
}

export interface UpdateChatModuleInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string | null;
  provider?: AiProvider;
  model?: string;
  apiKey?: string;
  isActive?: boolean;
  isDefault?: boolean;
  isGlobal?: boolean;
}

export interface AskQuestionInput {
  question: string;
  moduleId: string;
}

export interface AskQuestionAnswer {
  answer: string;
  moduleId: string;
  moduleName: string;
  sources: SourceCitation[];
}

function mapChatModule(raw: {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  provider: AiProvider;
  model: string;
  isActive: boolean;
  isDefault: boolean;
  isGlobal?: boolean;
  hasApiKey: boolean;
  maskedApiKey?: string | null;
  apiKey?: string | null;
  createdAt: string;
}): ChatModule {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? null,
    provider: raw.provider,
    model: raw.model,
    isActive: raw.isActive,
    isDefault: raw.isDefault,
    isGlobal: raw.isGlobal ?? false,
    hasApiKey: raw.hasApiKey,
    maskedApiKey: raw.maskedApiKey ?? null,
    apiKey: raw.apiKey ?? null,
    createdAt: raw.createdAt,
  };
}

export function mapChatModules(
  items: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    provider: AiProvider;
    model: string;
    isActive: boolean;
    isDefault: boolean;
    isGlobal?: boolean;
    hasApiKey: boolean;
    maskedApiKey?: string | null;
    apiKey?: string | null;
    createdAt: string;
  }>,
): ChatModule[] {
  return items.map(mapChatModule);
}

export function mapChatModuleOptions(
  items: Array<{
    id: string;
    name: string;
    description?: string | null;
    provider: AiProvider;
    model: string;
    isDefault: boolean;
    isGlobal?: boolean;
  }>,
): ChatModuleOption[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? null,
    provider: item.provider,
    model: item.model,
    isDefault: item.isDefault,
    isGlobal: item.isGlobal ?? false,
  }));
}
