import type { ReactNode } from 'react';

export function ChatLayout({
  sidebar,
  content,
  showContentOnMobile = false,
}: {
  sidebar: ReactNode;
  content: ReactNode;
  showContentOnMobile?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background text-onSurface">
      <div className="mx-auto flex min-h-screen max-w-[1800px] bg-surface">
        <aside
          className={[
            'w-full max-w-full bg-surfaceLow md:max-w-[380px] xl:max-w-[420px]',
            showContentOnMobile ? 'hidden md:block' : 'block',
          ].join(' ')}
        >
          {sidebar}
        </aside>
        <main className={[showContentOnMobile ? 'block' : 'hidden', 'flex-1 bg-surface md:block'].join(' ')}>
          {content}
        </main>
      </div>
    </div>
  );
}
