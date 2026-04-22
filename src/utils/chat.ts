import type { Chat, EntityId, User } from '@/types';

export function getChatCounterpart(chat: Chat, currentUserId?: EntityId | null): User | undefined {
  if (chat.counterpart) {
    return chat.counterpart;
  }

  return chat.participants.find((participant) => participant.id !== currentUserId) ?? chat.participants[0];
}

export function getOtherParticipant(chat: Chat, currentUserId?: EntityId | null): User | undefined {
  return getChatCounterpart(chat, currentUserId);
}
