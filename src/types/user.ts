import type { EntityId } from './common';

export interface User {
  id: EntityId;
  name: string;
  email?: string;
  createdAt?: string | null;
  avatarUrl?: string | null;
  online?: boolean;
}
