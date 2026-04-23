import type { ReactNode } from 'react';

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen justify-center bg-hero-radial px-4 py-8 text-onSurface">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] bg-surface shadow-ambient">
        <section className="hidden flex-1 flex-col justify-center bg-surfaceLow p-10 lg:flex">
          <div>
            <h1 className="max-w-lg font-display text-5xl font-extrabold tracking-[-0.03em] text-onSurface">
              Converse em tempo real com foco e privacidade.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-onSurfaceMuted">
              Mensagens rapidas, seguras e sem distracoes.
            </p>
          </div>
        </section>

        <section className="flex w-full flex-1 items-center justify-center px-6 py-10 lg:px-10">
          <div className="w-full max-w-md">
            <p className="text-sm uppercase tracking-[0.35em] text-onSurfaceSoft">RealTimeHub</p>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.03em] text-onSurface">
              {title}
            </h2>
            <p className="mt-3 text-base leading-7 text-onSurfaceMuted">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
