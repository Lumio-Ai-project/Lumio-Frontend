import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Popover } from '@/components/shared/Popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getDefaultModelForProvider } from '@/constants/ai-providers';
import { useCreateChatModule } from '@/hooks/use-chat-modules';
import { useRole } from '@/hooks/use-role';
import { PasswordInput } from '@/screens/Auth/components/PasswordInput';
import { AuthFormField } from '@/screens/Auth/components/AuthFormField';
import { ApiKeyProviderModelFields } from '@/screens/Dashboard/components/ApiKeyProviderModelFields';
import {
  createApiKeySchema,
  slugifyName,
  type CreateApiKeyFormData,
} from '@/screens/Dashboard/schemas/api-key.schema';

const DEFAULT_PROVIDER = 'OPENROUTER' as const;
const DEFAULT_MODEL = getDefaultModelForProvider(DEFAULT_PROVIDER);

interface CreateApiKeyPopoverProps {
  onSuccess?: () => void;
}

export function CreateApiKeyPopover({ onSuccess }: CreateApiKeyPopoverProps) {
  const [open, setOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const createModule = useCreateChatModule();
  const { isAdmin, isModerator } = useRole();
  const canSetGlobal = isAdmin || isModerator;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateApiKeyFormData>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      apiKey: '',
      provider: DEFAULT_PROVIDER,
      model: DEFAULT_MODEL,
      isActive: true,
      isDefault: false,
      isGlobal: canSetGlobal,
    },
  });

  const isActive = watch('isActive');
  const isDefault = watch('isDefault');
  const isGlobal = watch('isGlobal');
  const provider = watch('provider');
  const model = watch('model');

  const onSubmit = async (data: CreateApiKeyFormData) => {
    const scopedGlobal = canSetGlobal ? data.isGlobal : false;
    await createModule.mutateAsync({
      name: data.name,
      slug: data.slug?.trim() || slugifyName(data.name),
      description: data.description?.trim() || null,
      provider: data.provider,
      model: data.model,
      apiKey: data.apiKey,
      isActive: data.isActive,
      isDefault: scopedGlobal ? data.isDefault : false,
      isGlobal: scopedGlobal,
    });
    reset({
      name: '',
      slug: '',
      description: '',
      apiKey: '',
      provider: DEFAULT_PROVIDER,
      model: DEFAULT_MODEL,
      isActive: true,
      isDefault: false,
      isGlobal: canSetGlobal,
    });
    setSlugTouched(false);
    setOpen(false);
    onSuccess?.();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset({
        name: '',
        slug: '',
        description: '',
        apiKey: '',
        provider: DEFAULT_PROVIDER,
        model: DEFAULT_MODEL,
        isActive: true,
        isDefault: false,
        isGlobal: canSetGlobal,
      });
      setSlugTouched(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <Button type="button">Create API key</Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content size="half">
          <Popover.CloseIcon />
          <Popover.Header>
            <Popover.Title>Create API key</Popover.Title>
            <Popover.Description>
              Add a named AI module with its own API key for chat (Gemini or OpenRouter).
            </Popover.Description>
          </Popover.Header>

          <Popover.Body>
            <form
              id="create-api-key-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-stack"
            >
              <AuthFormField
                label="Name"
                error={errors.name?.message}
                {...register('name', {
                  onChange: (event) => {
                    if (!slugTouched) {
                      setValue('slug', slugifyName(event.target.value));
                    }
                  },
                })}
              />

              <AuthFormField
                label="Slug"
                error={errors.slug?.message}
                {...register('slug', {
                  onChange: () => setSlugTouched(true),
                })}
              />

              <div className="flex flex-col gap-stack-sm">
                <Label htmlFor="create-api-key-description">Description</Label>
                <textarea
                  id="create-api-key-description"
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('description')}
                />
              </div>

              <PasswordInput
                label="API key"
                autoComplete="off"
                error={errors.apiKey?.message}
                {...register('apiKey')}
              />

              <ApiKeyProviderModelFields
                idPrefix="create-api-key"
                provider={provider}
                model={model}
                onProviderChange={(nextProvider) => setValue('provider', nextProvider)}
                onModelChange={(nextModel) => setValue('model', nextModel)}
                providerError={errors.provider?.message}
                modelError={errors.model?.message}
              />

              {canSetGlobal ? (
                <fieldset className="flex flex-col gap-stack-sm">
                  <legend className="text-sm font-medium">Scope</legend>
                  <label className="flex items-center gap-stack-sm text-sm">
                    <input
                      type="radio"
                      name="create-scope"
                      checked={isGlobal}
                      onChange={() => {
                        setValue('isGlobal', true);
                      }}
                    />
                    Global (available to all users in chat)
                  </label>
                  <label className="flex items-center gap-stack-sm text-sm">
                    <input
                      type="radio"
                      name="create-scope"
                      checked={!isGlobal}
                      onChange={() => {
                        setValue('isGlobal', false);
                        setValue('isDefault', false);
                      }}
                    />
                    Specific (only for me)
                  </label>
                </fieldset>
              ) : null}

              <label className="flex items-center gap-stack-sm text-sm">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) => setValue('isActive', event.target.checked)}
                />
                Active
              </label>

              {canSetGlobal && isGlobal ? (
                <label className="flex items-center gap-stack-sm text-sm">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(event) => setValue('isDefault', event.target.checked)}
                  />
                  Set as default module
                </label>
              ) : null}
            </form>
          </Popover.Body>

          <Popover.Footer>
            <Popover.Close asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Popover.Close>
            <Button
              type="submit"
              form="create-api-key-form"
              disabled={isSubmitting || createModule.isPending}
            >
              {createModule.isPending ? 'Creating…' : 'Create API key'}
            </Button>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
