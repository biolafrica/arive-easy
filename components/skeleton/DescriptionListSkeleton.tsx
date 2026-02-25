interface DescriptionListSkeletonProps {
  rows?: number;
  showHeader?: boolean;
}

export function DescriptionListSkeleton({
  rows = 5,
  showHeader = true,
}: DescriptionListSkeletonProps) {
  return (
    <section className="space-y-6 animate-pulse">
      {showHeader && (
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="h-4 w-72 rounded bg-gray-200" />
        </div>
      )}

      <div className="divide-y rounded-lg border bg-white">
        {Array.from({ length: rows }).map((_, idx) => (
          <DescriptionRowSkeleton key={idx} />
        ))}
      </div>
    </section>
  );
}

function DescriptionRowSkeleton() {
  return (
    <div className="grid gap-2 px-4 py-5 sm:grid-cols-3 sm:gap-4">
      <div className="h-4 w-32 rounded bg-gray-200" />

      <div className="space-y-2 sm:col-span-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
      </div>
    </div>
  );
}