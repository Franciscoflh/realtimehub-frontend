import clsx from 'clsx';
import { Check, CheckCheck, MessageSquareText } from 'lucide-react';
import { Avatar } from './Avatar';
import { OnlineIndicator } from './OnlineIndicator';
import type { Chat, EntityId, User } from '@/types';
import { getChatCounterpart } from '@/utils/chat';
import { formatRelativeDay } from '@/utils/format';

function getLastMessagePreview(chat: Chat) {
  if (!chat.lastMessage) {
    return 'Conversa criada. Envie a primeira mensagem.';
  }

  if (typeof chat.lastMessage === 'string') {
    return chat.lastMessage;
  }

  return chat.lastMessage.content || 'Conversa criada. Envie a primeira mensagem.';
}

function isOwnLastMessage(chat: Chat, currentUserId?: EntityId | null) {
  return typeof chat.lastMessage === 'object' && !!chat.lastMessage && chat.lastMessage.sender.id === currentUserId;
}

function isLastMessageRead(chat: Chat) {
  if (!chat.lastMessage || typeof chat.lastMessage === 'string') {
    return false;
  }

  if (typeof chat.lastMessageReadByAll === 'boolean') {
    return chat.lastMessageReadByAll;
  }

  if (!chat.counterpartLastReadAt) {
    return false;
  }

  return new Date(chat.counterpartLastReadAt).getTime() >= new Date(chat.lastMessage.createdAt).getTime();
}

export function ChatList({
  chats,
  currentUserId,
  selectedChatId,
  onSelect,
  loading,
}: {
  chats: Chat[];
  currentUserId?: EntityId | null;
  selectedChatId: EntityId | null;
  onSelect: (chatId: EntityId) => void;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-[88px] animate-pulse rounded-3xl bg-surface" />
        ))}
      </div>
    );
  }

  if (!chats.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-[28px] bg-surface px-6 text-center">
        <MessageSquareText className="h-12 w-12 text-primary/70" />
        <p className="mt-4 font-display text-2xl font-bold text-onSurface">Nada por aqui ainda</p>
        <p className="mt-2 max-w-xs text-sm leading-6 text-onSurfaceMuted">
          Busque um usuário e inicie a primeira conversa do seu workspace em tempo real.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full space-y-2 overflow-y-auto pr-1">
      {chats.map((chat) => {
        const participant = getChatCounterpart(chat, currentUserId) ?? ({
          id: chat.id,
          name: 'Chat',
          email: '',
        } as User);

        return (
          <button
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={clsx(
              'flex w-full items-start gap-3 rounded-[26px] px-3 py-3 text-left transition',
              selectedChatId === chat.id ? 'bg-surfaceHigh shadow-bubble' : 'bg-transparent hover:bg-surface',
            )}
          >
            <Avatar name={participant.name} src={participant.avatarUrl} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate text-base font-semibold text-onSurface">{participant.name}</p>
                  <OnlineIndicator online={participant.online} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs uppercase tracking-[0.18em] text-onSurfaceSoft">
                    {formatRelativeDay(chat.activityAt ?? chat.lastMessageAt)}
                  </span>
                  {chat.unreadCount ? (
                    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-1 text-[11px] font-bold text-onPrimaryContainer">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-onSurfaceMuted">
                {isOwnLastMessage(chat, currentUserId) ? (
                  isLastMessageRead(chat) ? (
                    <CheckCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                  ) : (
                    <Check className="h-3.5 w-3.5 shrink-0 text-onSurfaceSoft" />
                  )
                ) : null}
                <p className="truncate">{getLastMessagePreview(chat)}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
