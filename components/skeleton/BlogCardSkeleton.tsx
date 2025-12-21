export function BlogCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm animate-pulse">
      {/* Image */}
      <div className="h-48 w-full rounded-t-xl bg-hover" />

      <div className="p-5 space-y-4">
        {/* Category */}
        <div className="h-4 w-24 rounded bg-hover" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-hover" />
          <div className="h-5 w-3/4 rounded bg-hover" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-hover" />
          <div className="h-4 w-5/6 rounded bg-hover" />
          <div className="h-4 w-2/3 rounded bg-hover" />
        </div>

        {/* Author + date */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 w-8 rounded-full bg-hover" />
          <div className="space-y-1">
            <div className="h-3 w-24 rounded bg-hover" />
            <div className="h-3 w-16 rounded bg-hover" />
          </div>
        </div>
      </div>
    </div>
  );
}


interface BlogGridSkeletonProps {
  count?: number;
}

export function AllBlogGridSkeleton({
  count = 6,
}: BlogGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}


export function FeaturedBlogGridSkeleton({
  count = 3,
}: BlogGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}


