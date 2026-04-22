import type { User } from './user';

export interface AuthResponse {
  token: string;
  user?: User | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
