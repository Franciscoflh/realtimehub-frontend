import type { User } from './user';
import type { EntityId, PageResponse } from './common';

export interface Message {
  id: EntityId;
  content: string;
  sender: User;
  chatId: EntityId;
  createdAt: string;
}

export type MessagePage = PageResponse<Message>;
