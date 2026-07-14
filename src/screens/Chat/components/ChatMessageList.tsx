import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat';

import { AssistantMessageContent } from './AssistantMessageContent';
import { AssistantTypingIndicator } from './AssistantTypingIndicator';

interface ChatMessageBubbleProps {
  message: Message;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'USER';

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground text-sm leading-relaxed whitespace-pre-wrap'
            : 'bg-muted text-foreground',
        )}
      >
        {isUser ? (
          message.content
        ) : (
          <AssistantMessageContent content={message.content} sources={message.sources} />
        )}
      </div>
    </div>
  );
}

interface ChatMessageListProps {
  messages: Message[];
  isLoading?: boolean;
  pendingAssistant?: boolean;
  streamingContent?: string;
}

export function ChatMessageList({
  messages,
  isLoading = false,
  pendingAssistant = false,
  streamingContent = '',
}: ChatMessageListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-stack py-4" aria-busy="true" aria-label="Loading messages">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              'flex w-full animate-pulse',
              index % 2 === 0 ? 'justify-end' : 'justify-start',
            )}
          >
            <div
              className={cn(
                'h-12 rounded-2xl bg-muted',
                index % 2 === 0 ? 'w-[45%]' : 'w-[58%]',
              )}
            />
          </div>
        ))}
      </div>
    );
  }

  const showStreamingBubble = pendingAssistant && streamingContent.length > 0;
  const showTyping = pendingAssistant && streamingContent.length === 0;

  if (messages.length === 0 && !pendingAssistant) {
    return null;
  }

  return (
    <div className="flex flex-col gap-stack">
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
      {showStreamingBubble ? (
        <div className="flex w-full justify-start">
          <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-3 text-foreground">
            <AssistantMessageContent content={streamingContent} sources={null} />
          </div>
        </div>
      ) : null}
      {showTyping ? <AssistantTypingIndicator /> : null}
    </div>
  );
}
