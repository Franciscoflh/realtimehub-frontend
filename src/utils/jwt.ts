import type { EntityId, User } from '@/types';

interface JwtPayload {
  sub?: string;
  email?: string;
  name?: string;
  userId?: EntityId;
  id?: EntityId;
}

export function parseUserFromToken(token: string): User | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const decoded = JSON.parse(window.atob(padded)) as JwtPayload;
    const userId = decoded.userId ?? decoded.id ?? decoded.sub ?? '';

    return {
      id: userId,
      email: decoded.email ?? decoded.sub ?? '',
      name: decoded.name ?? decoded.email ?? decoded.sub ?? 'Usuario',
    };
  } catch {
    return null;
  }
}
