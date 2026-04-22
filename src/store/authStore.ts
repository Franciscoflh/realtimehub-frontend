import { create } from 'zustand';
import { login as loginRequest, register as registerRequest } from '@/api/auth';
import type { LoginPayload, RegisterPayload, User } from '@/types';
import { parseUserFromToken } from '@/utils/jwt';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/utils/token';

interface AuthState {
  token: string | null;
  user: User | null;
  authenticating: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  hydrate: () => void;
  logout: () => void;
  setSession: (token: string, user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  authenticating: false,
  async login(payload) {
    set({ authenticating: true });
    try {
      const response = await loginRequest(payload);
      const user = response.user ?? parseUserFromToken(response.token);
      setStoredToken(response.token);
      set({ token: response.token, user, authenticating: false });
    } catch (error) {
      set({ authenticating: false });
      throw error;
    }
  },
  async register(payload) {
    set({ authenticating: true });
    try {
      const response = await registerRequest(payload);
      const user = response.user ?? parseUserFromToken(response.token);
      setStoredToken(response.token);
      set({ token: response.token, user, authenticating: false });
    } catch (error) {
      set({ authenticating: false });
      throw error;
    }
  },
  hydrate() {
    const token = getStoredToken();
    if (token) {
      set({ token, user: parseUserFromToken(token) });
    }
  },
  logout() {
    clearStoredToken();
    set({ token: null, user: null, authenticating: false });
  },
  setSession(token, user) {
    setStoredToken(token);
    set({ token, user });
  },
}));
