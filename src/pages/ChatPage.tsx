import { AxiosError } from 'axios';
import { LogOut } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatLayout } from '@/layouts/ChatLayout';
import { ChatList } from '@/components/ChatList';
import { ChatWindow } from '@/components/ChatWindow';
import { OnlineIndicator } from '@/components/OnlineIndicator';
import { Sidebar } from '@/components/Sidebar';
import { UserSearch } from '@/components/UserSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import type { Message, User } from '@/types';
import { stompService } from '@/websocket/stompService';

export function ChatPage() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const {
    chats,
    messagesByChat,
    searchedUsers,
    selectedChatId,
    chatsLoading,
    messagesLoading,
    usersSearching,
    websocketConnected,
    fetchAllChats,
    fetchChatMessages,
    searchAvailableUsers,
    clearUserSearch,
    createChatWithUser,
    selectChat,
    markChatRead,
    upsertIncomingMessage,
  } = useChatStore();

  const [query, setQuery] = useState('');
  const [messageValue, setMessageValue] = useState('');
  const [sending, setSending] = useState(false);
  const debouncedQuery = useDebounce(query, 350);

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === selectedChatId),
    [chats, selectedChatId],
  );
  const selectedMessages = selectedChatId ? messagesByChat[String(selectedChatId)] ?? [] : [];

  useEffect(() => {
    fetchAllChats().catch(() => undefined);
  }, [fetchAllChats]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      clearUserSearch();
      return;
    }

    searchAvailableUsers(debouncedQuery).catch(() => undefined);
  }, [clearUserSearch, debouncedQuery, searchAvailableUsers]);

  useEffect(() => {
    if (!selectedChatId) {
      return;
    }

    fetchChatMessages(selectedChatId).catch(() => undefined);
  }, [fetchChatMessages, selectedChatId]);

  useEffect(() => {
    if (!selectedChatId || !selectedChat?.unreadCount) {
      return;
    }

    const syncReadState = () => {
      if (document.visibilityState === 'visible') {
        markChatRead(selectedChatId).catch(() => undefined);
      }
    };

    syncReadState();
    window.addEventListener('focus', syncReadState);
    document.addEventListener('visibilitychange', syncReadState);

    return () => {
      window.removeEventListener('focus', syncReadState);
      document.removeEventListener('visibilitychange', syncReadState);
    };
  }, [markChatRead, selectedChat?.unreadCount, selectedChatId]);

  useEffect(() => {
    chats.forEach((chat) => {
      stompService.subscribe(chat.id, (frame) => {
        const payload = JSON.parse(frame.body) as Message;
        upsertIncomingMessage(payload);
      });
    });

    return () => {
      chats.forEach((chat) => stompService.unsubscribe(chat.id));
    };
  }, [chats, upsertIncomingMessage]);

  async function handleCreateChat(targetUser: User) {
    try {
      const chat = await createChatWithUser(targetUser.id);
      setQuery('');
      clearUserSearch();
      selectChat(chat.id);
      await fetchChatMessages(chat.id);
    } catch (caughtError) {
      console.error(caughtError);
    }
  }

  async function handleSubmitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedChatId || !messageValue.trim()) {
      return;
    }

    const content = messageValue.trim();

    try {
      setSending(true);
      setMessageValue('');

      stompService.sendMessage(selectedChatId, content);
    } catch (caughtError) {
      const message =
        caughtError instanceof AxiosError
          ? caughtError.message
          : caughtError instanceof Error
            ? caughtError.message
            : 'Falha ao enviar mensagem.';
      setMessageValue(content);
      console.error(message);
    } finally {
      setSending(false);
    }
  }

  function handleLogout() {
    stompService.disconnect();
    logout();
    navigate('/login', { replace: true });
  }

  if (!token) {
    return null;
  }

  return (
    <ChatLayout
      showContentOnMobile={Boolean(selectedChatId)}
      sidebar={
        <Sidebar
          onOpenSearch={() => {
            const input = document.querySelector<HTMLInputElement>('input[placeholder="Buscar usuarios ou conversas..."]');
            input?.focus();
          }}
          search={
            <UserSearch
              query={query}
              onQueryChange={setQuery}
              onSelectUser={handleCreateChat}
              results={searchedUsers.filter((item) => item.id !== user?.id)}
              searching={usersSearching}
            />
          }
          chatList={
            <ChatList
              chats={chats}
              currentUserId={user?.id}
              selectedChatId={selectedChatId}
              onSelect={selectChat}
              loading={chatsLoading}
            />
          }
          footer={
            <div className="flex items-center justify-between rounded-[26px] bg-surface px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-onSurface">{user?.name ?? 'Usuario'}</p>
                  <OnlineIndicator online={websocketConnected} />
                </div>
                <p className="truncate text-sm text-onSurfaceMuted">
                  {websocketConnected ? 'Conectado ao hub' : 'Reconectando ao hub'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surfaceLow text-onSurfaceMuted transition hover:bg-surfaceHigh hover:text-onSurface"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          }
        />
      }
      content={
        <ChatWindow
          chat={selectedChat}
          currentUser={user}
          messages={selectedMessages}
          loading={messagesLoading}
          sending={sending}
          connected={websocketConnected}
          messageValue={messageValue}
          onMessageChange={setMessageValue}
          onSubmitMessage={handleSubmitMessage}
          onBack={selectedChatId ? () => selectChat(null) : undefined}
        />
      }
    />
  );
}
