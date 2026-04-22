import clsx from 'clsx';

export function Avatar({
  name,
  src,
  className,
}: {
  name?: string | null;
  src?: string | null;
  className?: string;
}) {
  const safeName = name?.trim() || 'Usuario';
  const initials = safeName
    .split(' ')
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? '')
    .join('');

  if (src) {
    return <img src={src} alt={safeName} className={clsx('h-11 w-11 rounded-2xl object-cover', className)} />;
  }

  return (
    <div
      className={clsx(
        'flex h-11 w-11 items-center justify-center rounded-2xl bg-surfaceHigh font-semibold text-primary',
        className,
      )}
    >
      {initials}
    </div>
  );
}
