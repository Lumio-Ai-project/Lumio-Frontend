import { Plus } from 'lucide-react';
import { memo } from 'react';
import { NavLink, useMatch, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useMyChats } from '@/hooks/use-chats';
import { getChatConversationPath, ROUTES } from '@/routes/paths';
import type { Chat } from '@/types/chat';
import { cn } from '@/lib/utils';

import { DeleteChatPopover } from './DeleteChatPopover';

interface ChatConversationItemProps {
  chat: Chat;
  isActive: boolean;
}

const ChatConversationItem = memo(function ChatConversationItem({
  chat,
  isActive,
}: ChatConversationItemProps) {
  return (
    <div
      className={cn(
        'group flex min-w-0 items-center gap-1 rounded-md py-1.5 pl-6 pr-2 text-sm transition-colors duration-normal',
        isActive
          ? 'bg-accent/70 font-medium text-accent-foreground'
          : 'text-muted-foreground hover:bg-accent/40 hover:text-foreground',
      )}
    >
      <NavLink
        to={getChatConversationPath(chat.id)}
        className={cn('min-w-0 flex-1 truncate', isActive && 'text-accent-foreground')}
        title={chat.title}
      >
        {chat.title}
      </NavLink>
      <DeleteChatPopover chat={chat} />
    </div>
  );
});

export function ChatSidebarList() {
  const { data: chats = [], isLoading, isFetching } = useMyChats();
  const navigate = useNavigate();
  const activeMatch = useMatch({ path: ROUTES.CHAT_CONVERSATION, end: true });
  const activeChatId = activeMatch?.params.chatId;
  const showLoading = isLoading && chats.length === 0;

  return (
    <div className="mt-1 flex flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        className="h-auto justify-start gap-stack-sm border-0 bg-transparent px-3 py-1.5 pl-6 text-sm font-normal text-muted-foreground shadow-none hover:bg-accent/50 hover:text-foreground"
        onClick={() => navigate(ROUTES.CHAT)}
      >
        <Plus className="size-icon-xs shrink-0" aria-hidden />
        New chat
      </Button>

      {showLoading ? (
        <p className="px-6 py-1 text-xs text-muted-foreground">Loading chats…</p>
      ) : chats.length === 0 ? (
        <p className="px-6 py-1 text-xs text-muted-foreground">No conversations yet</p>
      ) : (
        <div
          className={cn(
            'flex max-h-48 flex-col gap-0.5 overflow-y-auto',
            isFetching && 'opacity-80',
          )}
        >
          {chats.map((chat) => (
            <ChatConversationItem
              key={chat.id}
              chat={chat}
              isActive={activeChatId === chat.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
