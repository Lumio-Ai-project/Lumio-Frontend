import { z } from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  slug: z.string().trim().max(80).optional(),
  description: z.string().trim().max(500).optional(),
  apiKey: z.string().trim().min(10, 'API key is required'),
  provider: z.enum(['GEMINI', 'OPENROUTER']),
  model: z.string().trim().min(1, 'Model is required').max(100),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  isGlobal: z.boolean(),
});

export const editApiKeySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  slug: z.string().trim().min(1, 'Slug is required').max(80),
  description: z.string().trim().max(500).optional(),
  apiKey: z
    .union([z.literal(''), z.string().trim().min(10, 'API key must be at least 10 characters')])
    .optional(),
  provider: z.enum(['GEMINI', 'OPENROUTER']),
  model: z.string().trim().min(1, 'Model is required').max(100),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  isGlobal: z.boolean(),
});

export type CreateApiKeyFormData = z.infer<typeof createApiKeySchema>;
export type EditApiKeyFormData = z.infer<typeof editApiKeySchema>;

export function slugifyName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
