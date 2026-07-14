import { Outlet } from 'react-router-dom';
import { MessageSquare, Newspaper } from 'lucide-react';

import { ThemeToggle } from '@/components/shared/ThemeToggle';

import { AuthBrand } from './components/AuthBrand';

const AUTH_FEATURES = [
  {
    icon: Newspaper,
    title: 'Personalized feeds',
    description: 'News tailored to what you care about.',
  },
  {
    icon: MessageSquare,
    title: 'AI chat assistant',
    description: 'Ask questions about current events.',
  },
] as const;

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-dark lg:flex lg:flex-col gap-40 lg:p-section">
        <AuthBrand inverted className="relative z-10" />

        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex flex-col gap-stack">
            <h1 className=" hidden lg:block text-4xl font-bold tracking-tight text-primary-foreground">
              Your AI News Assistant
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-primary-foreground/80">
              Stay informed with personalized news summaries and intelligent chat.
            </p>
          </div>

          <ul className="flex flex-col gap-stack">
            {AUTH_FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-stack-sm">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 ring-1 ring-primary-foreground/10">
                  <Icon className="size-icon-sm text-primary-foreground" aria-hidden />
                </span>
                <div>
                  <p className="font-medium text-primary-foreground">{title}</p>
                  <p className="text-sm text-primary-foreground/70">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>    
      </div>

      <div className="relative flex min-w-0 flex-col bg-background">
        <div className="absolute right-page top-page z-10">
          <ThemeToggle />
        </div>

        <div className="relative flex flex-1 flex-col items-center justify-center px-page py-page-lg">
          <div className="mb-page w-full max-w-form lg:hidden">
            <AuthBrand />
            <p className="mt-stack-sm text-center hidden text-sm text-muted-foreground">
              Your AI news assistant
            </p>
          </div>

          <div className="w-full max-w-form">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
