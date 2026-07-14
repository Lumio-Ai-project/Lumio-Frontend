import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Filter,
  MessageSquare,
  Newspaper,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';

export const LANDING_STATS = [
  { value: '12+', label: 'Trusted news sources' },
  { value: 'Daily', label: 'Automatic updates' },
  { value: 'RAG', label: 'Grounded AI answers' },
  { value: 'Hybrid', label: 'Semantic + keyword search' },
] as const;

export const LANDING_FEATURES: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: MessageSquare,
    title: 'RAG-powered chat',
    description:
      'Ask about AI, tech, science, or world news and get answers grounded in real articles — powered by Gemini.',
  },
  {
    icon: Newspaper,
    title: 'Personalized news feed',
    description:
      'Browse curated headlines, save preferences, and track the topics and categories you care about most.',
  },
  {
    icon: BookOpen,
    title: 'Source attribution',
    description:
      'Every answer links back to the original article with source name, publish date, and relevance score.',
  },
  {
    icon: Search,
    title: 'Hybrid search',
    description:
      'Combines vector embeddings with BM25 keyword search so you find the most relevant news chunks every time.',
  },
  {
    icon: Filter,
    title: 'Smart filtering',
    description:
      'Filter by date, source, category, or language — e.g. “Reuters AI news from yesterday.”',
  },
  {
    icon: RefreshCw,
    title: 'Always up to date',
    description:
      'Articles are scraped, chunked, embedded, and indexed automatically so your answers reflect recent news.',
  },
];

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Collect news',
    description:
      'Scheduled scrapers pull articles from Reuters, TechCrunch, The Verge, OpenAI, and other public sources.',
  },
  {
    step: '02',
    title: 'Index with AI',
    description:
      'Articles are split into semantic chunks and stored in MongoDB Atlas with vector embeddings for search.',
  },
  {
    step: '03',
    title: 'Retrieve & rank',
    description:
      'Your question triggers hybrid search — vector similarity plus keyword matching — with optional metadata filters.',
  },
  {
    step: '04',
    title: 'Answer with sources',
    description:
      'Gemini generates a grounded summary from the top chunks, with links and attribution for every claim.',
  },
] as const;

export const EXAMPLE_QUESTIONS = [
  'What happened in AI today?',
  'Summarize this week\'s technology news.',
  'Show Reuters articles about Bitcoin.',
  'Latest NVIDIA news.',
  'Technology news from yesterday.',
  'What are today\'s biggest headlines?',
] as const;

export const NEWS_SOURCE_GROUPS = [
  {
    category: 'Technology',
    sources: ['TechCrunch', 'The Verge', 'VentureBeat', 'The Next Web'],
  },
  {
    category: 'AI',
    sources: ['OpenAI', 'Anthropic', 'DeepMind', 'Hugging Face'],
  },
  {
    category: 'General & Science',
    sources: ['Reuters', 'AP News', 'ScienceDaily', 'Phys.org'],
  },
] as const;

export const LANDING_HERO = {
  badge: 'RAG-powered news assistant',
  badgeIcon: Sparkles,
  title: 'Stay informed with Lumio',
  subtitle:
    'Your graduation-project AI news assistant — scrape, search, and chat over real articles with full source attribution.',
} as const;
