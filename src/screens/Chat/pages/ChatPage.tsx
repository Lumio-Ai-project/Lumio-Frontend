import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useChatStream } from '@/contexts/StreamContext';
import { useAvailableChatModules } from '@/hooks/use-chat-modules';
import { useChatMessages } from '@/hooks/use-chats';
import { getChatConversationPath } from '@/routes/paths';
import { cn } from '@/lib/utils';

import { ChatComposer } from '../components/ChatComposer';
import { ChatMessageList } from '../components/ChatMessageList';

export function ChatPage() {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();
  const { send, stop, isPending, streamingContent } = useChatStream(chatId);
  const { data: modules = [] } = useAvailableChatModules();
  const { data: messages = [], isLoading: isLoadingMessages } = useChatMessages(chatId);

  const defaultModuleId =
    modules.find((module) => module.isDefault)?.id ?? modules[0]?.id ?? '';

  const [moduleId, setModuleId] = useState(defaultModuleId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (defaultModuleId && !moduleId) {
      setModuleId(defaultModuleId);
    }
  }, [defaultModuleId, moduleId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending, streamingContent]);

  const handleSend = useCallback(
    async (content: string, selectedModuleId: string) => {
      await send(
        {
          chatId,
          content,
          moduleId: selectedModuleId,
        },
        {
          onChatCreated: (createdChatId) => {
            navigate(getChatConversationPath(createdChatId), { replace: true });
          },
        },
      );
    },
    [chatId, navigate, send],
  );

  const hasMessages = messages.length > 0 || isPending;
  const isEmptyState = !chatId && !hasMessages;
  const showPersistedLoading = Boolean(chatId && isLoadingMessages);

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-narrow flex-col px-page',
        isEmptyState
          ? 'min-h-[calc(100vh-4rem)] justify-center py-section'
          : 'min-h-[calc(100vh-4rem)] py-page',
      )}
    >
      {isEmptyState ? (
        <div className="mb-stack text-center">
          <h1 className="text-2xl font-semibold text-foreground">How can I help you today?</h1>
        </div>
      ) : (
        <div className="pb-stack">
          <ChatMessageList
            messages={messages}
            isLoading={showPersistedLoading}
            pendingAssistant={isPending}
            streamingContent={streamingContent}
          />
          <div ref={messagesEndRef} />
        </div>
      )}

      <div
        className={cn(
          isEmptyState
            ? 'w-full'
            : 'sticky bottom-0 bg-linear-to-t from-background from-70% to-transparent pt-stack pb-1',
        )}
      >
        <ChatComposer
          onSend={handleSend}
          onStop={stop}
          isSending={isPending}
          moduleId={moduleId}
          onModuleChange={setModuleId}
        />
      </div>
    </div>
  );
}
