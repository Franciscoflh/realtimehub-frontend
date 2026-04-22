import { create } from 'zustand';
import { createPrivateChat, fetchChats, fetchMessages, markChatAsRead, searchUsers } from '@/api/chats';
import type { Chat, EntityId, Message, User } from '@/types';

interface ChatState {
  chats: Chat[];
  messagesByChat: Record<string, Message[]>;
  searchedUsers: User[];
  selectedChatId: EntityId | null;
  chatsLoading: boolean;
  messagesLoading: boolean;
  usersSearching: boolean;
  websocketConnected: boolean;
  fetchAllChats: () => Promise<void>;
  fetchChatMessages: (chatId: EntityId) => Promise<void>;
  searchAvailableUsers: (query: string) => Promise<void>;
  clearUserSearch: () => void;
  createChatWithUser: (targetUserId: EntityId) => Promise<Chat>;
  selectChat: (chatId: EntityId | null) => void;
  markChatRead: (chatId: EntityId) => Promise<void>;
  mergeChat: (chat: Chat) => void;
  upsertIncomingMessage: (message: Message) => void;
  markWebsocketConnected: (connected: boolean) => void;
  reset: () => void;
}

function getChatSortTime(chat: Chat) {
  return new Date(chat.activityAt ?? chat.lastMessageAt ?? chat.updatedAt ?? chat.createdAt ?? 0).getTime();
}

function sortChats(chats: Chat[]) {
  return [...chats].sort((left, right) => {
    const leftDate = getChatSortTime(left);
    const rightDate = getChatSortTime(right);
    return rightDate - leftDate;
  });
}

function mergeChatList(chats: Chat[], nextChat: Chat) {
  return sortChats([nextChat, ...chats.filter((item) => item.id !== nextChat.id)]);
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  messagesByChat: {},
  searchedUsers: [],
  selectedChatId: null,
  chatsLoading: false,
  messagesLoading: false,
  usersSearching: false,
  websocketConnected: false,
  async fetchAllChats() {
    set({ chatsLoading: true });
    try {
      const chats = await fetchChats();
      set({ chats: sortChats(chats), chatsLoading: false });
    } catch (error) {
      set({ chatsLoading: false });
      throw error;
    }
  },
  async fetchChatMessages(chatId) {
    set({ messagesLoading: true });
    try {
      const page = await fetchMessages(chatId);
      const sortedMessages = [...page.content].sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
      );
      set((state) => ({
        messagesByChat: {
          ...state.messagesByChat,
          [String(chatId)]: sortedMessages,
        },
        messagesLoading: false,
      }));
    } catch (error) {
      set({ messagesLoading: false });
      throw error;
    }
  },
  async searchAvailableUsers(query) {
    if (!query.trim()) {
      set({ searchedUsers: [] });
      return;
    }

    set({ usersSearching: true });
    try {
      const users = await searchUsers(query);
      set({ searchedUsers: users, usersSearching: false });
    } catch (error) {
      set({ usersSearching: false });
      throw error;
    }
  },
  clearUserSearch() {
    set({ searchedUsers: [], usersSearching: false });
  },
  async createChatWithUser(targetUserId) {
    const chat = await createPrivateChat({ targetUserId });
    set((state) => ({
      chats: mergeChatList(state.chats, chat),
      selectedChatId: chat.id,
    }));
    return chat;
  },
  selectChat(chatId) {
    set({ selectedChatId: chatId });
  },
  async markChatRead(chatId) {
    const updatedChat = await markChatAsRead(chatId);
    set((state) => ({
      chats: mergeChatList(state.chats, {
        ...updatedChat,
        unreadCount: 0,
      }),
    }));
  },
  mergeChat(chat) {
    set((state) => ({
      chats: mergeChatList(state.chats, chat),
    }));
  },
  upsertIncomingMessage(message) {
    set((state) => {
      const chatKey = String(message.chatId);
      const chatMessages = state.messagesByChat[chatKey] ?? [];
      const alreadyExists = chatMessages.some((entry) => entry.id === message.id);
      const messages = alreadyExists
        ? chatMessages.map((entry) => (entry.id === message.id ? message : entry))
        : [...chatMessages, message];

      const chat = state.chats.find((entry) => entry.id === message.chatId);
      const updatedChat: Chat | undefined = chat
        ? {
            ...chat,
            lastMessage: message,
            lastMessageAt: message.createdAt,
            activityAt: message.createdAt,
            lastMessageReadByAll: false,
            lastReadAt: state.selectedChatId === message.chatId ? message.createdAt : chat.lastReadAt,
            unreadCount:
              state.selectedChatId === message.chatId
                ? 0
                : (chat.unreadCount ?? 0) +
                  (message.sender.id === chat.counterpart?.id || chat.counterpart == null ? 1 : 0),
          }
        : undefined;

      const remainingChats = state.chats.filter((entry) => entry.id !== message.chatId);

      return {
        messagesByChat: {
          ...state.messagesByChat,
          [chatKey]: messages.sort(
            (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
          ),
        },
        chats: sortChats(updatedChat ? [updatedChat, ...remainingChats] : state.chats),
      };
    });
  },
  markWebsocketConnected(connected) {
    set({ websocketConnected: connected });
  },
  reset() {
    set({
      chats: [],
      messagesByChat: {},
      searchedUsers: [],
      selectedChatId: null,
      chatsLoading: false,
      messagesLoading: false,
      usersSearching: false,
      websocketConnected: false,
    });
  },
}));
