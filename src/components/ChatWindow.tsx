import { ArrowLeft, LoaderCircle, Phone, Search, Video } from 'lucide-react';
import { useMemo, useRef, type FormEvent } from 'react';
import { Avatar } from './Avatar';
import { EmptyChatState } from './EmptyChatState';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { OnlineIndicator } from './OnlineIndicator';
import type { Chat, Message, User } from '@/types';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { getOtherParticipant } from '@/utils/chat';

export function ChatWindow({
  chat,
  currentUser,
  messages,
  loading,
  sending,
  connected,
  messageValue,
  onMessageChange,
  onSubmitMessage,
  onBack,
}: {
  chat?: Chat;
  currentUser?: User | null;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  connected: boolean;
  messageValue: string;
  onMessageChange: (value: string) => void;
  onSubmitMessage: (event: FormEvent<HTMLFormElement>) => void;
  onBack?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useAutoScroll(scrollRef, messages.length);

  const participant = useMemo(
    () => (chat ? getOtherParticipant(chat, currentUser?.id) : undefined),
    [chat, currentUser?.id],
  );

  if (!chat) {
    return <EmptyChatState />;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between gap-4 px-8 py-5">
        <div className="flex items-center gap-4">
          {onBack ? (
            <button
              onClick={onBack}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surfaceLow text-onSurfaceMuted transition hover:bg-surfaceHigh hover:text-onSurface md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}
          <Avatar name={participant?.name ?? 'Chat'} src={participant?.avatarUrl} className="h-14 w-14" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold text-onSurface">{participant?.name ?? 'Conversa'}</h2>
              <OnlineIndicator online={participant?.online || connected} />
            </div>
            <p className="text-sm text-onSurfaceMuted">{connected ? 'Ao vivo agora' : 'Reconectando...'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-onSurfaceMuted">
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surfaceLow transition hover:bg-surfaceHigh hover:text-onSurface">
            <Phone className="h-4 w-4" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surfaceLow transition hover:bg-surfaceHigh hover:text-onSurface">
            <Video className="h-4 w-4" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surfaceLow transition hover:bg-surfaceHigh hover:text-onSurface">
            <Search className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-8 py-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : null}
        {!loading && !messages.length ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="font-display text-3xl font-bold text-onSurface">Nenhuma mensagem ainda</p>
              <p className="mt-3 text-sm text-onSurfaceMuted">Abra a conversa com a primeira mensagem.</p>
            </div>
          </div>
        ) : null}
        {!loading
          ? messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender.id === currentUser?.id}
              />
            ))
          : null}
      </div>

      <footer className="px-6 pb-6 pt-3">
        <div className="rounded-[30px] bg-surfaceLow p-4">
          <MessageInput
            value={messageValue}
            onChange={onMessageChange}
            onSubmit={onSubmitMessage}
            disabled={sending || !connected}
          />
          <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-onSurfaceSoft">
            {connected ? 'Mensagens protegidas e sincronizadas em tempo real' : 'Tentando restabelecer a conexao'}
          </p>
        </div>
      </footer>
    </div>
  );
}
