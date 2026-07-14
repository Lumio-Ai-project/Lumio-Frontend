import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Popover } from '@/components/shared/Popover';
import { Button } from '@/components/ui/button';
import { useDeleteTemplate } from '@/hooks/use-templates';
import type { Template } from '@/types/template';

interface DeleteTemplatePopoverProps {
  template: Pick<Template, 'id' | 'name'>;
  disabled?: boolean;
  onDeleted?: () => void;
  triggerVariant?: 'icon' | 'button';
}

export function DeleteTemplatePopover({
  template,
  disabled,
  onDeleted,
  triggerVariant = 'icon',
}: DeleteTemplatePopoverProps) {
  const [open, setOpen] = useState(false);
  const deleteTemplate = useDeleteTemplate();

  const handleDelete = async () => {
    await deleteTemplate.mutateAsync(template.id);
    setOpen(false);
    onDeleted?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        {triggerVariant === 'button' ? (
          <Button
            type="button"
            variant="destructive"
            disabled={disabled || deleteTemplate.isPending}
          >
            Delete
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="h-auto border-0 bg-transparent p-2 text-primary shadow-none hover:bg-transparent hover:text-primary/80"
            disabled={disabled || deleteTemplate.isPending}
            onClick={(event) => event.stopPropagation()}
            aria-label={`Delete ${template.name}`}
          >
            <Trash2 className="size-icon-sm" aria-hidden />
          </Button>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content size="sm">
          <Popover.CloseIcon />
          <Popover.Header>
            <Popover.Title>Delete template</Popover.Title>
            <Popover.Description>
              Delete <span className="font-medium text-foreground">{template.name}</span>? This
              action cannot be undone.
            </Popover.Description>
          </Popover.Header>
          <Popover.Footer>
            <Popover.Close asChild>
              <Button type="button" variant="outline" disabled={deleteTemplate.isPending}>
                Cancel
              </Button>
            </Popover.Close>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteTemplate.isPending}
              onClick={() => void handleDelete()}
            >
              {deleteTemplate.isPending ? 'Deleting…' : 'Delete template'}
            </Button>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
