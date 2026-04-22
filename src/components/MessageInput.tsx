import { SendHorizontal } from 'lucide-react';
import type { FormEvent } from 'react';

export function MessageInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}) {
  const trimmed = value.trim();

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-3">
      <div className="flex-1 rounded-[24px] bg-background px-4 py-3 shadow-[inset_0_0_0_1px_rgba(179,188,204,0.08)]">
        <textarea
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Escreva uma mensagem..."
          className="max-h-40 min-h-[48px] w-full resize-none bg-transparent pt-1 text-sm leading-6 text-onSurface outline-none placeholder:text-onSurfaceSoft"
        />
      </div>
      <button
        disabled={disabled || !trimmed}
        className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary-gradient text-onPrimaryContainer shadow-ambient transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <SendHorizontal className="h-5 w-5" />
      </button>
    </form>
  );
}
