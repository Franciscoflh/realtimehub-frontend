import clsx from 'clsx';
import type { Message } from '@/types';
import { formatTime } from '@/utils/format';

export function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  return (
    <div className={clsx('flex animate-messageIn', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={clsx(
          'max-w-[min(80%,680px)] px-4 py-3 shadow-bubble',
          isOwn
            ? 'rounded-[18px_18px_6px_18px] bg-primaryContainer text-onPrimaryContainer'
            : 'rounded-[18px_18px_18px_6px] bg-surfaceHigh text-onSurface',
        )}
      >
        {!isOwn ? <p className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-onSurfaceSoft">{message.sender.name}</p> : null}
        <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>
        <p className={clsx('mt-2 text-right text-[11px]', isOwn ? 'text-onPrimaryContainer/75' : 'text-onSurfaceSoft')}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
