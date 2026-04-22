export function OnlineIndicator({ online }: { online?: boolean }) {
  if (!online) {
    return <span className="inline-flex h-3 w-3 rounded-full bg-onSurfaceSoft/60" />;
  }

  return (
    <span className="relative inline-flex h-3 w-3 items-center justify-center">
      <span className="absolute inset-0 rounded-full border border-primary/40 animate-pulseRing" />
      <span className="h-2 w-2 rounded-full bg-primary" />
    </span>
  );
}
