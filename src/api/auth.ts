import { api } from './client';
import type { AuthResponse, LoginPayload, RegisterPayload } from '@/types';

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
  return data;
}
