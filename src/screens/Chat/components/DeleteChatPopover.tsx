import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

import { Popover } from '@/components/shared/Popover';
import { Button } from '@/components/ui/button';
import { useDeleteChat } from '@/hooks/use-chats';
import { ROUTES } from '@/routes/paths';
import type { Chat } from '@/types/chat';

interface DeleteChatPopoverProps {
  chat: Chat;
}

export function DeleteChatPopover({ chat }: DeleteChatPopoverProps) {
  const [open, setOpen] = useState(false);
  const deleteChat = useDeleteChat();
  const navigate = useNavigate();
  const activeMatch = useMatch({ path: ROUTES.CHAT_CONVERSATION, end: true });

  const handleDelete = async () => {
    await deleteChat.mutateAsync(chat.id);
    setOpen(false);
    if (activeMatch?.params.chatId === chat.id) {
      navigate(ROUTES.CHAT);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-auto shrink-0 border-0 bg-transparent p-1 text-muted-foreground opacity-0 shadow-none transition-opacity group-hover:opacity-100 hover:bg-transparent hover:text-destructive"
          disabled={deleteChat.isPending}
          aria-label={`Delete ${chat.title}`}
        >
          <Trash2 className="size-icon-xs" aria-hidden />
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Overlay />
        <Popover.Content size="sm">
          <Popover.CloseIcon />
          <Popover.Header>
            <Popover.Title>Delete chat</Popover.Title>
            <Popover.Description>
              Delete <span className="font-medium text-foreground">{chat.title}</span>? This action
              cannot be undone.
            </Popover.Description>
          </Popover.Header>
          <Popover.Footer>
            <Popover.Close asChild>
              <Button type="button" variant="outline" disabled={deleteChat.isPending}>
                Cancel
              </Button>
            </Popover.Close>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteChat.isPending}
              onClick={() => void handleDelete()}
            >
              {deleteChat.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </Popover.Footer>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
