export interface SourceCitation {
  source: string;
  title: string;
  url: string;
  publishedAt: string;
}

export function formatPublishedDate(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(isoDate));
}
