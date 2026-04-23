import { MessageSquareText, Orbit } from 'lucide-react';

export function EmptyChatState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="relative flex h-40 w-40 items-center justify-center rounded-[42px] bg-surfaceLow shadow-bubble">
        <div className="absolute h-24 w-24 rounded-[28px] bg-surface" />
        <MessageSquareText className="relative z-10 h-12 w-12 text-primary" />
        <Orbit className="absolute right-10 top-10 h-5 w-5 text-primary/80" />
      </div>
      <h2 className="mt-10 font-display text-5xl font-extrabold tracking-[-0.03em] text-onSurface">
        Selecione uma conversa
      </h2>
      <p className="mt-4 max-w-xl text-lg leading-8 text-onSurfaceMuted">
        Escolha um chat na lateral para comecar.
      </p>
    </div>
  );
}
