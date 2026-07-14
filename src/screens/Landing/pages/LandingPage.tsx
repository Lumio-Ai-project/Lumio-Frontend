import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES, getHomeRouteForRole } from '@/routes/paths';

import { RevealOnScroll } from '../components/RevealOnScroll';
import {
  EXAMPLE_QUESTIONS,
  HOW_IT_WORKS,
  LANDING_FEATURES,
  LANDING_HERO,
  LANDING_STATS,
  NEWS_SOURCE_GROUPS,
} from '../constants/landing-content';

export function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const homeRoute = getHomeRouteForRole(user?.role);
  const BadgeIcon = LANDING_HERO.badgeIcon;

  return (
    <div className="mx-auto flex max-w-content flex-col px-page pb-section">
      {/* Hero */}
      <section className="flex flex-col items-center py-section text-center">
        <div
          className="mb-stack inline-flex animate-fade-in-up items-center gap-stack-sm rounded-full border border-border bg-card px-stack py-1.5 text-sm text-muted-foreground"
          style={{ animationDelay: '0ms' }}
        >
          <BadgeIcon className="size-icon-sm text-primary" aria-hidden />
          {LANDING_HERO.badge}
        </div>

        <h1
          className="max-w-narrow animate-fade-in-up text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ animationDelay: '80ms' }}
        >
          {LANDING_HERO.title}
        </h1>
        <p
          className="mt-stack max-w-form animate-fade-in-up text-lg text-muted-foreground"
          style={{ animationDelay: '160ms' }}
        >
          {LANDING_HERO.subtitle}
        </p>

        <div
          className="mt-stack flex animate-fade-in-up flex-wrap justify-center gap-stack"
          style={{ animationDelay: '240ms' }}
        >
          <Link
            to={isAuthenticated ? homeRoute : ROUTES.LOGIN}
            state={isAuthenticated ? undefined : { from: { pathname: ROUTES.CHAT } }}
          >
            <Button size="lg" className="gap-stack-sm">
              <MessageSquare className="size-icon-sm" aria-hidden />
              {isAuthenticated ? 'Open AI Chat' : 'Try AI Chat'}
            </Button>
          </Link>
          {!isAuthenticated && (
            <Link to={ROUTES.REGISTER}>
              <Button variant="outline" size="lg">
                Create account
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Stats */}
      <RevealOnScroll>
        <section
          aria-label="Platform highlights"
          className="grid grid-cols-2 gap-stack rounded-xl border border-border bg-card p-card sm:grid-cols-4"
        >
          {LANDING_STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-primary">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>
      </RevealOnScroll>

      {/* Features */}
      <section aria-labelledby="features-heading" className="mt-section">
        <RevealOnScroll className="mb-stack text-center">
          <h2 id="features-heading" className="text-2xl font-bold sm:text-3xl">
            Everything you need to follow the news
          </h2>
          <p className="mt-stack-sm text-muted-foreground">
            Built for a RAG pipeline — React frontend, GraphQL backend, and FastAPI AI service.
          </p>
        </RevealOnScroll>

        <div className="grid gap-stack sm:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURES.map(({ icon: Icon, title, description }, index) => (
            <RevealOnScroll key={title} delay={index * 80}>
              <div className="landing-card-hover h-full rounded-lg border border-border bg-card p-card text-left">
                <Icon className="mb-stack-sm size-icon-xl text-primary" aria-hidden />
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-stack-sm text-sm text-muted-foreground">{description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-it-works-heading" className="mt-section">
        <RevealOnScroll className="mb-stack text-center">
          <h2 id="how-it-works-heading" className="text-2xl font-bold sm:text-3xl">
            How Lumio works
          </h2>
          <p className="mt-stack-sm text-muted-foreground">
            From raw articles to grounded answers in four steps.
          </p>
        </RevealOnScroll>

        <ol className="grid gap-stack sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map(({ step, title, description }, index) => (
            <RevealOnScroll
              key={step}
              as="li"
              delay={index * 80}
              className="landing-card-hover relative h-full rounded-lg border border-border bg-card p-card text-left"
            >
              <span className="text-sm font-semibold text-primary">{step}</span>
              <h3 className="mt-stack-sm text-lg font-semibold">{title}</h3>
              <p className="mt-stack-sm text-sm text-muted-foreground">{description}</p>
            </RevealOnScroll>
          ))}
        </ol>
      </section>

      {/* Example questions */}
      <section aria-labelledby="examples-heading" className="mt-section">
        <RevealOnScroll className="mb-stack text-center">
          <h2 id="examples-heading" className="text-2xl font-bold sm:text-3xl">
            Ask anything about the news
          </h2>
          <p className="mt-stack-sm text-muted-foreground">
            Sign in and try questions like these in the AI chat.
          </p>
        </RevealOnScroll>

        <ul className="flex flex-wrap justify-center gap-stack-sm">
          {EXAMPLE_QUESTIONS.map((question, index) => (
            <RevealOnScroll key={question} as="li" delay={index * 50}>
              <span className="inline-block rounded-full border border-border bg-muted px-stack py-1.5 text-sm text-foreground transition-colors duration-normal hover:border-primary/40 hover:bg-accent">
                {question}
              </span>
            </RevealOnScroll>
          ))}
        </ul>
      </section>

      {/* News sources */}
      <section aria-labelledby="sources-heading" className="mt-section">
        <RevealOnScroll className="mb-stack text-center">
          <h2 id="sources-heading" className="text-2xl font-bold sm:text-3xl">
            Powered by trusted sources
          </h2>
          <p className="mt-stack-sm text-muted-foreground">
            Articles are indexed from leading technology, AI, and general news outlets.
          </p>
        </RevealOnScroll>

        <div className="grid gap-stack sm:grid-cols-3">
          {NEWS_SOURCE_GROUPS.map(({ category, sources }, index) => (
            <RevealOnScroll key={category} delay={index * 100}>
              <div className="landing-card-hover h-full rounded-lg border border-border bg-card p-card text-left">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {category}
                </h3>
                <ul className="mt-stack-sm flex flex-wrap gap-stack-sm">
                  {sources.map((source) => (
                    <li
                      key={source}
                      className="rounded-md bg-muted px-2.5 py-1 text-sm text-muted-foreground"
                    >
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}
      <RevealOnScroll className="mt-section">
        <section
          aria-label="Get started"
          className="rounded-xl bg-brand-gradient p-card text-center text-primary-foreground sm:p-section"
        >
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to explore the news with AI?</h2>
          <p className="mx-auto mt-stack-sm max-w-form text-primary-foreground/85">
            Create a free account to chat with Lumio, browse your feed, and get answers backed by
            real articles.
          </p>
          <div className="mt-stack flex flex-wrap justify-center gap-stack">
            {isAuthenticated ? (
              <Link to={homeRoute}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-stack-sm bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <MessageSquare className="size-icon-sm" aria-hidden />
                  Open AI Chat
                </Button>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.REGISTER}>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    Get started free
                  </Button>
                </Link>
                <Link to={ROUTES.LOGIN}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Log in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
