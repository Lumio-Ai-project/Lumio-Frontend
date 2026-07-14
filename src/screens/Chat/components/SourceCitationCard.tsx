import { ExternalLink } from 'lucide-react';

import { formatPublishedDate, type SourceCitation } from '@/types/source-citation';

interface SourceCitationCardProps {
  citation: SourceCitation;
  index: number;
}

export function SourceCitationCard({ citation, index }: SourceCitationCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card/60 px-3 py-2 text-xs">
      <p className="font-medium text-foreground">
        {index + 1}. {citation.source}
      </p>
      <a
        href={citation.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center gap-1 text-foreground underline-offset-2 hover:underline"
      >
        {citation.title}
        <ExternalLink className="size-3 shrink-0" aria-hidden />
      </a>
      <p className="mt-1 text-muted-foreground">{formatPublishedDate(citation.publishedAt)}</p>
    </article>
  );
}
