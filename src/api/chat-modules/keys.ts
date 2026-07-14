export const chatModuleKeys = {
  all: ['chat-modules'] as const,
  lists: () => [...chatModuleKeys.all, 'list'] as const,
  list: () => [...chatModuleKeys.lists(), 'admin'] as const,
  available: () => [...chatModuleKeys.all, 'available'] as const,
};
