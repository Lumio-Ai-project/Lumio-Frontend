import { ArrowUp, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAvailableChatModules } from "@/hooks/use-chat-modules";
import { cn } from "@/lib/utils";

import { ChatModuleSelect } from "./ChatModuleSelect";

interface ChatComposerProps {
  onSend: (content: string, moduleId: string) => Promise<void>;
  onStop?: () => void;
  isSending?: boolean;
  moduleId: string;
  onModuleChange: (moduleId: string) => void;
  placeholder?: string;
  className?: string;
}

export function ChatComposer({
  onSend,
  onStop,
  isSending = false,
  moduleId,
  onModuleChange,
  placeholder = "How can I help you today?",
  className,
}: ChatComposerProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: modules = [] } = useAvailableChatModules();

  const effectiveModuleId =
    moduleId ||
    modules.find((module) => module.isDefault)?.id ||
    modules[0]?.id ||
    "";

  useEffect(() => {
    if (!moduleId && effectiveModuleId) {
      onModuleChange(effectiveModuleId);
    }
  }, [effectiveModuleId, moduleId, onModuleChange]);

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [content, resizeTextarea]);

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed || !effectiveModuleId) {
      return;
    }

    setContent("");
    await onSend(trimmed, effectiveModuleId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const canSend = content.trim().length > 0 && Boolean(effectiveModuleId);
  const showStop = isSending && onStop;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring",
        className,
      )}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isSending ? "Type to send a new message..." : placeholder}
        disabled={modules.length === 0}
        rows={1}
        aria-label="Message input"
        className=" max-h-50 min-h-14 w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="flex items-center flex-wrap justify-end gap-2 px-3 pb-3">
        <ChatModuleSelect
          value={effectiveModuleId}
          onChange={onModuleChange}
          disabled={false}
        />
        {showStop ? (
          <Button
            type="button"
            aria-label="Stop generating"
            onClick={onStop}
            variant="destructive"
            className="size-9 shrink-0 rounded-full p-0"
          >
            <Square className="size-3.5 shrink-0" fill="currentColor" strokeWidth={0} aria-hidden />
          </Button>
        ) : (
          <Button
            type="button"
            aria-label="Send message"
            disabled={!canSend}
            onClick={() => void handleSend()}
            className="size-9 shrink-0 rounded-full p-0"
          >
            <ArrowUp className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
          </Button>
        )}
      </div>
    </div>
  );
}
