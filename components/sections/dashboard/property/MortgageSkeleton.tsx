interface MortgageCardSkeletonProps {
  count?: number;
}

export function MortgageCardSkeleton({
  count = 2,
}: MortgageCardSkeletonProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-border bg-card p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="h-4 w-64 rounded bg-muted" />
            </div>
            <div className="h-6 w-28 rounded bg-muted" />
          </div>

          {/* Stats */}
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b pb-2 last:border-b-0"
              >
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-28 rounded bg-muted" />
              <div className="h-5 w-12 rounded bg-muted" />
            </div>
            <div className="h-2 w-full rounded bg-muted" />
            <div className="flex justify-between">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-3 w-28 rounded bg-muted" />
            </div>
          </div>

          {/* Dates */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
            </div>
          </div>

          {/* Button */}
          <div className="mt-6 h-10 w-full rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
