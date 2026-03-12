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
              alt="kletch icon"
              aria-hidden="true"
              className="w-10 h-10"
            />
          </div>

          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              border: "3px solid transparent",
              borderTopColor: "var(--color-accent, #2563EB)",
              borderRightColor: "var(--color-accent, #2563EB)",
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
            className="h-full rounded-full bg-[#2563EB] origin-left"
            style={{
              animation: "loadingBar 1.6s ease-in-out infinite",
            }}
          />
        </div>

        <p className="text-sm text-muted-foreground tracking-wide animate-pulse select-none">
          Loading…
        </p>
      </div>

    </div>
  );
}