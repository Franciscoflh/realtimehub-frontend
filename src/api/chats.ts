import { api } from './client';
import type { Chat, CreatePrivateChatPayload, EntityId, MessagePage, PageResponse, User } from '@/types';

export async function searchUsers(query: string) {
  const { data } = await api.get<PageResponse<User>>('/api/users', {
    params: {
      search: query,
      page: 0,
      size: 20,
    },
  });
  return data.content;
}

export async function createPrivateChat(payload: CreatePrivateChatPayload) {
  const { data } = await api.post<Chat>('/api/chats/private', payload);
  return data;
}

export async function fetchChats() {
  const { data } = await api.get<Chat[]>('/api/chats');
  return data;
}

export async function markChatAsRead(chatId: EntityId) {
  const { data } = await api.post<Chat>(`/api/chats/${chatId}/read`);
  return data;
}

export async function fetchMessages(chatId: EntityId, page = 0, size = 20) {
  const { data } = await api.get<MessagePage>(`/api/chats/${chatId}/messages`, {
    params: { page, size },
  });
  return data;
}
