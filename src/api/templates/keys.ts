import type { TemplateChannel } from '@/types/template';

export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters?: { channel?: TemplateChannel; activeOnly?: boolean }) =>
    [...templateKeys.lists(), filters ?? {}] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};
