import type { SourceCitation } from '@/types/source-citation';

import { SourceCitationCard } from './SourceCitationCard';

interface SourceCitationListProps {
  sources: SourceCitation[];
}

export function SourceCitationList({ sources }: SourceCitationListProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sources</p>
      <div className="space-y-2">
        {sources.map((citation, index) => (
          <SourceCitationCard key={`${citation.url}-${index}`} citation={citation} index={index} />
        ))}
      </div>
    </div>
  );
}
