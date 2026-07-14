import { createContext, useContext, type ReactNode } from 'react';

import { useSidebar } from '@/hooks/use-sidebar';

interface SidebarContextValue {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

interface SidebarProviderProps {
  children: ReactNode;
  storageKey?: string;
}

export function SidebarProvider({ children, storageKey }: SidebarProviderProps) {
  const sidebar = useSidebar(storageKey);

  return <SidebarContext.Provider value={sidebar}>{children}</SidebarContext.Provider>;
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within SidebarProvider');
  }
  return context;
}
