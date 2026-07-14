import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Popover } from '@/components/shared/Popover';
import { Button } from '@/components/ui/button';
import { useDeleteUser } from '@/hooks/use-users';
import type { User } from '@/types/auth';

interface DeleteUserPopoverProps {
  user: User;
  disabled?: boolean;
}

export function DeleteUserPopover({ user, disabled }: DeleteUserPopoverProps) {
  const [open, setOpen] = useState(false);
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    await deleteUser.mutateAsync(user.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-auto border-0 bg-transparent p-2 text-primary shadow-none hover:bg-transparent hover:text-primary/80"
          disabled={disabled || deleteUser.isPending}
          onClick={(event) => event.stopPropagation()}
          aria-label={`Delete ${user.name}`}
        >
          <Trash2 className="size-icon-sm" aria-hidden />
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content size="sm">
          <Popover.CloseIcon />
          <Popover.Header>
            <Popover.Title>Delete user</Popover.Title>
            <Popover.Description>
              Delete <span className="font-medium text-foreground">{user.name}</span>? This action
              cannot be undone.
            </Popover.Description>
          </Popover.Header>
          <Popover.Footer>
            <Popover.Close asChild>
              <Button type="button" variant="outline" disabled={deleteUser.isPending}>
                Cancel
              </Button>
            </Popover.Close>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteUser.isPending}
              onClick={() => void handleDelete()}
            >
              {deleteUser.isPending ? 'Deleting…' : 'Delete user'}
            </Button>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
