import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/contexts/AuthContext';
import { StreamProvider } from '@/contexts/StreamContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { router } from '@/routes';

import './index.css';

const FIVE_MINUTES = 5 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: FIVE_MINUTES,
    },
  },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StreamProvider>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </StreamProvider>
    </QueryClientProvider>
  </StrictMode>,
);
