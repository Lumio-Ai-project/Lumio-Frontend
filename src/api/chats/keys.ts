export const chatKeys = {
  all: ['chats'] as const,
  lists: () => [...chatKeys.all, 'list'] as const,
  list: () => [...chatKeys.lists()] as const,
  messages: (chatId: string) => [...chatKeys.all, 'messages', chatId] as const,
};
