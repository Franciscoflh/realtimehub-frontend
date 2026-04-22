import type { ReactNode } from 'react';
import { PlusSquare } from 'lucide-react';
import { Logo } from './Logo';

export function Sidebar({
  search,
  chatList,
  footer,
  onOpenSearch,
}: {
  search: ReactNode;
  chatList: ReactNode;
  footer: ReactNode;
  onOpenSearch: () => void;
}) {
  return (
    <div className="flex h-screen flex-col px-4 pb-4 pt-5 md:px-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <Logo />
        <button
          onClick={onOpenSearch}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-onSurfaceMuted transition hover:bg-surfaceHigh hover:text-onSurface"
          aria-label="Nova conversa"
        >
          <PlusSquare className="h-5 w-5" />
        </button>
      </div>

      {search}
      <div className="mt-5 flex-1 overflow-hidden">{chatList}</div>
      <div className="mt-4">{footer}</div>
    </div>
  );
}
