import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { AuthPage } from '@/pages/AuthPage';
import { ChatPage } from '@/pages/ChatPage';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { stompService } from '@/websocket/stompService';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
}

export function RouterProvider() {
  const token = useAuthStore((state) => state.token);
  const hydrate = useAuthStore((state) => state.hydrate);
  const logout = useAuthStore((state) => state.logout);
  const resetChat = useChatStore((state) => state.reset);
  const markConnected = useChatStore((state) => state.markWebsocketConnected);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const handleUnauthorized = () => {
      stompService.disconnect();
      resetChat();
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout, resetChat]);

  useEffect(() => {
    const removeListener = stompService.addStatusListener(markConnected);
    return () => {
      removeListener();
    };
  }, [markConnected]);

  useEffect(() => {
    if (!token) {
      stompService.disconnect();
      resetChat();
      return;
    }

    stompService.connect(token);

    return () => {
      stompService.disconnect();
    };
  }, [token, resetChat]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage mode="login" />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AuthPage mode="register" />
          </PublicRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}
