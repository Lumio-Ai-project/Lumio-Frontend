import Markdown from 'react-markdown';

import type { SourceCitation } from '@/types/source-citation';

import { SourceCitationList } from './SourceCitationList';

interface AssistantMessageContentProps {
  content: string;
  sources: SourceCitation[] | null;
}

export function AssistantMessageContent({ content, sources }: AssistantMessageContentProps) {
  return (
    <div className="text-sm leading-relaxed">
      <Markdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
        }}
      >
        {content}
      </Markdown>
      {sources && sources.length > 0 ? <SourceCitationList sources={sources} /> : null}
    </div>
  );
}
