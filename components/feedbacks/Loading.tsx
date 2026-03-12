export default function Loading() {
  return (
    <div
      className="fixed inset-0 bg-background flex items-center justify-center z-50"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-6">

        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-card rounded-full shadow-lg border border-border flex items-center justify-center">
            <img
              src="/icons/kletch-color.svg"
              alt=""
              aria-hidden="true"
              className="w-10 h-10"
            />
          </div>

          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: "3px solid transparent",
              borderTopColor: "var(--color-accent, #6366f1)",
              borderRightColor: "var(--color-accent, #6366f1)",
            }}
          />
        </div>

        <div
          className="w-48 h-1 bg-border rounded-full overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading progress"
        >
          <div
            className="h-full rounded-full bg-accent origin-left"
            style={{
              animation: "loadingBar 1.6s ease-in-out infinite",
            }}
          />
        </div>

        <p className="text-sm text-muted-foreground tracking-wide animate-pulse select-none">
          Loading…
        </p>
      </div>

      <style>{`
        @keyframes loadingBar {
          0%   { transform: translateX(-100%) scaleX(0.3); }
          50%  { transform: translateX(60%)  scaleX(0.7); }
          100% { transform: translateX(200%) scaleX(0.3); }
        }
      `}</style>
    </div>
  );
}