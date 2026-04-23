import { LoaderCircle } from 'lucide-react';
import type { FormEvent } from 'react';

interface AuthFormProps {
  mode: 'login' | 'register';
  values: Record<string, string>;
  loading: boolean;
  error: string | null;
  onChange: (field: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function AuthForm({ mode, values, loading, error, onChange, onSubmit }: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {mode === 'register' ? (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-onSurfaceMuted">Nome</span>
          <input
            value={values.name ?? ''}
            onChange={(event) => onChange('name', event.target.value)}
            className="w-full rounded-2xl bg-background px-4 py-4 text-onSurface outline-none transition focus:shadow-[inset_0_-2px_0_0_#598cff]"
            placeholder="Seu nome"
          />
        </label>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-onSurfaceMuted">Email</span>
        <input
          type="email"
          value={values.email ?? ''}
          onChange={(event) => onChange('email', event.target.value)}
          className="w-full rounded-2xl bg-background px-4 py-4 text-onSurface outline-none transition focus:shadow-[inset_0_-2px_0_0_#598cff]"
          placeholder="voce@empresa.com"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-onSurfaceMuted">Senha</span>
        <input
          type="password"
          value={values.password ?? ''}
          onChange={(event) => onChange('password', event.target.value)}
          className="w-full rounded-2xl bg-background px-4 py-4 text-onSurface outline-none transition focus:shadow-[inset_0_-2px_0_0_#598cff]"
          placeholder="********"
        />
      </label>

      {error ? <div className="rounded-2xl bg-[rgba(255,123,145,0.12)] px-4 py-3 text-sm text-danger">{error}</div> : null}

      <button
        disabled={loading}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-gradient font-semibold text-onPrimaryContainer transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {mode === 'login' ? 'Entrar' : 'Criar conta'}
      </button>
    </form>
  );
}
