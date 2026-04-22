import { Search, UserPlus2 } from 'lucide-react';
import { Avatar } from './Avatar';
import type { User } from '@/types';

export function UserSearch({
  query,
  onQueryChange,
  onSelectUser,
  results,
  searching,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSelectUser: (user: User) => void;
  results: User[];
  searching: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3">
        <Search className="h-4 w-4 text-onSurfaceSoft" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar usuários ou conversas..."
          className="w-full bg-transparent text-sm text-onSurface outline-none placeholder:text-onSurfaceSoft"
        />
      </div>

      {query.trim() ? (
        <div className="glass-panel ghost-border max-h-72 overflow-y-auto rounded-[24px] p-2 shadow-ambient">
          {searching ? <p className="px-3 py-4 text-sm text-onSurfaceMuted">Buscando usuários...</p> : null}
          {!searching && !results.length ? (
            <p className="px-3 py-4 text-sm text-onSurfaceMuted">Nenhum usuário encontrado.</p>
          ) : null}
          {results.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-surfaceHigh/70"
            >
              <Avatar name={user.name} src={user.avatarUrl} className="h-10 w-10" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-onSurface">{user.name}</p>
                <p className="truncate text-xs text-onSurfaceMuted">{user.email}</p>
              </div>
              <UserPlus2 className="h-4 w-4 text-primary" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
