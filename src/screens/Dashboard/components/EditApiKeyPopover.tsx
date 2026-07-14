import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Popover } from '@/components/shared/Popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateChatModule } from '@/hooks/use-chat-modules';
import { useRole } from '@/hooks/use-role';
import { AuthFormField } from '@/screens/Auth/components/AuthFormField';
import {
  editApiKeySchema,
  type EditApiKeyFormData,
} from '@/screens/Dashboard/schemas/api-key.schema';
import type { ChatModule } from '@/types/chat-module';

interface EditApiKeyPopoverProps {
  module: ChatModule;
}

export function EditApiKeyPopover({ module }: EditApiKeyPopoverProps) {
  const [open, setOpen] = useState(false);
  const updateModule = useUpdateChatModule();
  const { isAdmin, isModerator } = useRole();
  const canSetGlobal = isAdmin || isModerator;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditApiKeyFormData>({
    resolver: zodResolver(editApiKeySchema),
    defaultValues: {
      name: module.name,
      slug: module.slug,
      description: module.description ?? '',
      apiKey: module.apiKey ?? '',
      provider: module.provider,
      model: module.model,
      isActive: module.isActive,
      isDefault: module.isDefault,
      isGlobal: module.isGlobal,
    },
  });

  const isActive = watch('isActive');
  const isDefault = watch('isDefault');
  const isGlobal = watch('isGlobal');

  useEffect(() => {
    if (open) {
      reset({
        name: module.name,
        slug: module.slug,
        description: module.description ?? '',
        apiKey: module.apiKey ?? '',
        provider: module.provider,
        model: module.model,
        isActive: module.isActive,
        isDefault: module.isDefault,
        isGlobal: module.isGlobal,
      });
    }
  }, [open, module, reset]);

  const onSubmit = async (data: EditApiKeyFormData) => {
    const trimmedApiKey = data.apiKey?.trim() ?? '';
    const apiKeyChanged = trimmedApiKey !== (module.apiKey ?? '');
    const scopedGlobal = canSetGlobal ? data.isGlobal : false;

    await updateModule.mutateAsync({
      id: module.id,
      name: data.name,
      slug: data.slug,
      description: data.description?.trim() || null,
      provider: data.provider,
      model: data.model,
      ...(apiKeyChanged && trimmedApiKey ? { apiKey: trimmedApiKey } : {}),
      isActive: data.isActive,
      isDefault: scopedGlobal ? data.isDefault : false,
      ...(canSetGlobal ? { isGlobal: scopedGlobal } : {}),
    });
    setOpen(false);
  };

  const handleCopyApiKey = async () => {
    const value = watch('apiKey')?.trim();
    if (!value) {
      toast.error('No API key to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      toast.success('API key copied');
    } catch {
      toast.error('Failed to copy API key');
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-auto border-0 bg-transparent p-2 shadow-none hover:bg-accent/50"
          onClick={(event) => event.stopPropagation()}
          aria-label={`Edit ${module.name}`}
        >
          <Pencil className="size-icon-sm" aria-hidden />
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content size="half">
          <Popover.CloseIcon />
          <Popover.Header>
            <Popover.Title>Edit API key</Popover.Title>
            <Popover.Description>
              Update module settings. Edit the API key below or leave it unchanged.
            </Popover.Description>
          </Popover.Header>

          <Popover.Body>
            <form
              id={`edit-api-key-form-${module.id}`}
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-stack"
            >
              <AuthFormField label="Name" error={errors.name?.message} {...register('name')} />
              <AuthFormField label="Slug" error={errors.slug?.message} {...register('slug')} />

              <div className="flex flex-col gap-stack-sm">
                <Label htmlFor={`edit-api-key-description-${module.id}`}>Description</Label>
                <textarea
                  id={`edit-api-key-description-${module.id}`}
                  className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('description')}
                />
              </div>

              <div className="flex flex-col gap-stack-sm">
                <Label htmlFor={`edit-api-key-value-${module.id}`}>API key</Label>
                <div className="relative">
                  <Input
                    id={`edit-api-key-value-${module.id}`}
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    aria-invalid={errors.apiKey ? true : undefined}
                    className="pr-10 font-mono text-xs"
                    {...register('apiKey')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-normal hover:text-foreground"
                    onClick={() => void handleCopyApiKey()}
                    aria-label="Copy API key"
                  >
                    <Copy className="size-icon-sm" aria-hidden />
                  </button>
                </div>
                {errors.apiKey?.message ? (
                  <p className="text-sm text-destructive">{errors.apiKey.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-stack-sm">
                <Label htmlFor={`edit-api-key-provider-${module.id}`}>Provider</Label>
                <select
                  id={`edit-api-key-provider-${module.id}`}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  {...register('provider')}
                >
                  <option value="GEMINI">Gemini (Google AI)</option>
                  <option value="OPENROUTER">OpenRouter</option>
                </select>
              </div>

              <AuthFormField label="Model" error={errors.model?.message} {...register('model')} />

              {canSetGlobal ? (
                <fieldset className="flex flex-col gap-stack-sm">
                  <legend className="text-sm font-medium">Scope</legend>
                  <label className="flex items-center gap-stack-sm text-sm">
                    <input
                      type="radio"
                      name={`edit-scope-${module.id}`}
                      checked={isGlobal}
                      onChange={() => setValue('isGlobal', true)}
                    />
                    Global (available to all users in chat)
                  </label>
                  <label className="flex items-center gap-stack-sm text-sm">
                    <input
                      type="radio"
                      name={`edit-scope-${module.id}`}
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
                  Default module
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
              form={`edit-api-key-form-${module.id}`}
              disabled={isSubmitting || updateModule.isPending}
            >
              {updateModule.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
