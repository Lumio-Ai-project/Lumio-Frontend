import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Popover } from '@/components/shared/Popover';
import { Button } from '@/components/ui/button';
import { useDeleteChatModule } from '@/hooks/use-chat-modules';
import type { ChatModule } from '@/types/chat-module';

interface DeleteApiKeyPopoverProps {
  module: ChatModule;
}

export function DeleteApiKeyPopover({ module }: DeleteApiKeyPopoverProps) {
  const [open, setOpen] = useState(false);
  const deleteModule = useDeleteChatModule();

  const handleDelete = async () => {
    await deleteModule.mutateAsync(module.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-auto border-0 bg-transparent p-2 text-primary shadow-none hover:bg-transparent hover:text-primary/80"
          disabled={deleteModule.isPending}
          onClick={(event) => event.stopPropagation()}
          aria-label={`Delete ${module.name}`}
        >
          <Trash2 className="size-icon-sm" aria-hidden />
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content size="sm">
          <Popover.CloseIcon />
          <Popover.Header>
            <Popover.Title>Delete API key</Popover.Title>
            <Popover.Description>
              Delete <span className="font-medium text-foreground">{module.name}</span>? This
              action cannot be undone.
            </Popover.Description>
          </Popover.Header>
          <Popover.Footer>
            <Popover.Close asChild>
              <Button type="button" variant="outline" disabled={deleteModule.isPending}>
                Cancel
              </Button>
            </Popover.Close>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteModule.isPending}
              onClick={() => void handleDelete()}
            >
              {deleteModule.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
