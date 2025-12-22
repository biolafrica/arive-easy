import { Skeleton } from "@/utils/skeleton";

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

export function ArticlePageSkeleton() {
  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-10">

      {/* Breadcrumb */}
      <div className="mb-4">
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Header */}
      <header className="mb-8 space-y-4">
        {/* Title */}
        <Skeleton className="h-9 w-full max-w-3xl" />
        <Skeleton className="h-9 w-3/4" />

        {/* Meta + Share */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>

          <Skeleton className="h-8 w-20" />
        </div>
      </header>

      {/* Hero Image */}
      <Skeleton className="mb-10 aspect-[16/9] w-full rounded-xl" />

      {/* Article Content */}
      <div className="space-y-6">

        {/* Section heading */}
        <Skeleton className="h-6 w-40" />

        {/* Paragraphs */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        {/* Inline Image */}
        <Skeleton className="aspect-[16/9] w-full rounded-lg" />
        <Skeleton className="mx-auto h-3 w-32" />

        {/* More text */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />

        {/* Blockquote */}
        <div className="rounded-lg border-l-4 border-border pl-4">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="mt-2 h-4 w-3/5" />
        </div>

        {/* Conclusion */}
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
      </div>

      {/* Tags */}
      <div className="mt-10 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-6 w-24 rounded-full"
          />
        ))}
      </div>
    </article>
  );
}



