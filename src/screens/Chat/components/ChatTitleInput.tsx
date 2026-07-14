import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { chatKeys } from "@/api/chats/keys";
import { useMyChats, useUpdateChat } from "@/hooks/use-chats";
import { cn } from "@/lib/utils";
import type { Chat } from "@/types/chat";

const RENAME_DEBOUNCE_MS = 400;

function updateChatTitleInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  chatId: string,
  title: string,
) {
  queryClient.setQueryData<Chat[]>(chatKeys.list(), (current) =>
    (current ?? []).map((chat) =>
      chat.id === chatId ? { ...chat, title } : chat,
    ),
  );
}

export function ChatTitleInput() {
  const { chatId } = useParams<{ chatId?: string }>();
  const queryClient = useQueryClient();
  const { data: chats = [] } = useMyChats(Boolean(chatId));
  const updateChatMutation = useUpdateChat();

  const chat = chats.find((item) => item.id === chatId);
  const savedTitle = chat?.title ?? "";

  const [title, setTitle] = useState(savedTitle);
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPersistedRef = useRef(savedTitle);

  useEffect(() => {
    setIsFocused(false);
  }, [chatId]);

  useEffect(() => {
    if (!chat || isFocused) {
      return;
    }

    setTitle(savedTitle);
    lastPersistedRef.current = savedTitle;
  }, [chat, savedTitle, isFocused]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  if (!chatId || !chat) {
    return null;
  }

  const persistTitle = (nextTitle: string) => {
    const trimmed = nextTitle.trim();
    if (!trimmed || trimmed === lastPersistedRef.current) {
      return;
    }

    updateChatMutation.mutate(
      { id: chatId, title: trimmed },
      {
        onSuccess: (updatedChat) => {
          lastPersistedRef.current = updatedChat.title;
        },
      },
    );
  };

  const handleChange = (value: string) => {
    setTitle(value);
    updateChatTitleInCache(queryClient, chatId, value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      persistTitle(value);
    }, RENAME_DEBOUNCE_MS);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(lastPersistedRef.current);
      updateChatTitleInCache(queryClient, chatId, lastPersistedRef.current);
      setIsFocused(false);
      return;
    }

    if (trimmed !== title) {
      setTitle(trimmed);
      updateChatTitleInCache(queryClient, chatId, trimmed);
    }

    persistTitle(trimmed);
    setIsFocused(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
    if (event.key === "Escape") {
      setTitle(lastPersistedRef.current);
      updateChatTitleInCache(queryClient, chatId, lastPersistedRef.current);
      event.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      value={title}
      onChange={(event) => handleChange(event.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      maxLength={200}
      aria-label="Chat name"
      size={Math.min(Math.max(title.length, 1), 50)}
      className={cn(
        "w-fit min-w-[6ch] max-w-md field-sizing-content rounded-md bg-card px-2 py-1.5 text-sm font-medium text-foreground",
        "border border-transparent outline-none transition-[border-color,box-shadow] duration-normal",
        "focus:border-border focus:ring-2 focus:ring-ring",
      )}
    />
  );
}
