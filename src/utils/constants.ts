const currentOrigin =
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
const currentHost = typeof window !== 'undefined' ? window.location.host : 'localhost:5173';

const wsProtocol = currentOrigin.startsWith('https') ? 'wss' : 'ws';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const WS_URL = import.meta.env.VITE_WS_URL || `${wsProtocol}://${currentHost}/ws`;
export const TOKEN_STORAGE_KEY = 'realtimehub.token';
