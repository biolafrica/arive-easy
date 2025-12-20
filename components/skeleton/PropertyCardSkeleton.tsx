export function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm animate-pulse">
      {/* Image */}
      <div className="relative h-48 w-full rounded-t-xl bg-hover" />

      <div className="p-5 space-y-4">
        {/* Title + heart */}
        <div className="flex items-start justify-between gap-2">
          <div className="h-5 w-3/4 rounded bg-hover" />
          <div className="h-5 w-5 rounded-full bg-hover" />
        </div>

        {/* Price rows */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-24 rounded bg-hover" />
            <div className="h-4 w-20 rounded bg-hover" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded bg-hover" />
            <div className="h-4 w-16 rounded bg-hover" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-md bg-hover" />
          <div className="h-6 w-20 rounded-md bg-hover" />
          <div className="h-6 w-16 rounded-md bg-hover" />
        </div>

        {/* Meta rows */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-28 rounded bg-hover" />
            <div className="h-4 w-16 rounded bg-hover" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-32 rounded bg-hover" />
            <div className="h-4 w-20 rounded bg-hover" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-28 rounded bg-hover" />
            <div className="h-4 w-14 rounded bg-hover" />
          </div>
        </div>
      </div>
    </div>
  );
}


interface PropertyGridSkeletonProps {
  count?: number;
}

export function AllPropertyGridSkeleton({
  count = 6,
}: PropertyGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FeaturedPropertyGridSkeleton({
  count = 3,
}: PropertyGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}