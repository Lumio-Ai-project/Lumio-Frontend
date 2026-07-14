import { useCallback, useEffect, useState } from 'react';

const DEFAULT_STORAGE_KEY = 'lumio:sidebar-open';

function readStoredOpen(storageKey: string): boolean {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      return stored === 'true';
    }
  } catch {
    // localStorage unavailable (private browsing, etc.)
  }
  return true;
}

export function useSidebar(storageKey = DEFAULT_STORAGE_KEY) {
  const [isOpen, setIsOpen] = useState(() => readStoredOpen(storageKey));

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(isOpen));
    } catch {
      // ignore
    }
  }, [isOpen, storageKey]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, toggle, open, close };
}
