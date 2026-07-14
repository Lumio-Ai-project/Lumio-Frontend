import type { AiProvider } from '@/types/chat-module';

export interface SelectOption {
  value: string;
  label: string;
}

export const AI_PROVIDER_OPTIONS: SelectOption[] = [
  { value: 'GEMINI', label: 'Gemini (Google AI)' },
  { value: 'OPENROUTER', label: 'OpenRouter' },
];

export const AI_MODEL_OPTIONS: Record<AiProvider, SelectOption[]> = {
  GEMINI: [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  ],
  OPENROUTER: [
    { value: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Meta Llama 3.3 70B (Free)' },
    { value: 'google/gemma-4-31b-it:free', label: 'Google Gemma 4 31B (Free)' },
    { value: 'openrouter/free', label: 'OpenRouter Auto (Free)' },
  ],
};

export function getDefaultModelForProvider(provider: AiProvider): string {
  return AI_MODEL_OPTIONS[provider][0]?.value ?? '';
}

export function getModelOptionsForProvider(
  provider: AiProvider,
  currentModel?: string,
): SelectOption[] {
  const options = [...AI_MODEL_OPTIONS[provider]];
  const trimmed = currentModel?.trim();

  if (trimmed && !options.some((option) => option.value === trimmed)) {
    options.push({ value: trimmed, label: `${trimmed} (custom)` });
  }

  return options;
}
