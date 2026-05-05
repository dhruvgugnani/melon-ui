const edgeSurface =
  "bg-[repeating-linear-gradient(60deg,#3a5930_0,#2e4a25_14px,#162912_28px,#162912_42px)] shadow-[0_0_32px_rgba(0,0,0,0.78)]";

export function Frame() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      <div className={`absolute inset-x-0 top-0 h-3 ${edgeSurface}`} />
      <div className={`absolute inset-x-0 bottom-0 h-3 ${edgeSurface}`} />
      <div className={`absolute inset-y-0 left-0 w-3 ${edgeSurface}`} />
      <div className={`absolute inset-y-0 right-0 w-3 ${edgeSurface}`} />
      <div className="absolute inset-3 rounded-[34px] shadow-[inset_0_0_24px_rgba(0,0,0,0.72)]" />
    </div>
  );
}
