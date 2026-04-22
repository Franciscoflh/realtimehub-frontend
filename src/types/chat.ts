import type { User } from './user';
import type { EntityId } from './common';
import type { Message } from './message';

export type ChatType = 'PRIVATE' | 'GROUP' | string;

export interface Chat {
  id: EntityId;
  type?: ChatType;
  counterpart?: User | null;
  participants: User[];
  lastMessage?: string | Message | null;
  lastMessageAt?: string | null;
  lastReadAt?: string | null;
  counterpartLastReadAt?: string | null;
  lastMessageReadByAll?: boolean;
  activityAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  unreadCount?: number;
}

export interface CreatePrivateChatPayload {
  targetUserId: EntityId;
}
