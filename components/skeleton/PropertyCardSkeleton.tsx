import { Skeleton } from "@/utils/skeleton";
interface PropertyGridSkeletonProps { count?: number}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm animate-pulse">

      <div className="relative h-48 w-full rounded-t-xl bg-hover" />

      <div className="p-5 space-y-4">

        <div className="flex items-start justify-between gap-2">
          <div className="h-5 w-3/4 rounded bg-hover" />
          <div className="h-5 w-5 rounded-full bg-hover" />
        </div>

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


        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-md bg-hover" />
          <div className="h-6 w-20 rounded-md bg-hover" />
          <div className="h-6 w-16 rounded-md bg-hover" />
        </div>


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

export function AllPropertyGridSkeleton({count = 3}: PropertyGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-5">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PropertyDetailsPageSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">

      <header className="mb-8 space-y-4">
        <Skeleton className="h-4 w-40" />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-80" />
            <Skeleton className="h-4 w-64" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="aspect-[16/10] w-full rounded-xl" />

          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-20 w-28 rounded-lg"
              />
            ))}
          </div>

          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>

        <aside className="space-y-6">


          <div className="rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>

          <div className="rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>

          <div className="rounded-xl border border-border p-5 space-y-3">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>


          <div className="space-y-3">
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        </aside>
      </div>


      <section className="mt-16 space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-7 w-56 mx-auto" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[420px] rounded-xl"
            />
          ))}
        </div>
      </section>
    </section>
  );
}

export function PropertyListingCardSkeleton() {
  return (
    <div className="flex overflow-hidden rounded-xl border bg-white gap-5 h-[280px] animate-pulse">
      <div className="w-[380px] flex-shrink-0 bg-gray-200" />

      <div className="flex flex-1 flex-col justify-between py-4 pr-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 w-64 bg-gray-200 rounded" />
            <div className="h-6 w-48 bg-gray-200 rounded" />
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </div>

        <div className="flex items-center gap-6">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-200 rounded" />
        </div>

        <div className="h-8 w-32 bg-gray-200 rounded" />

        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>
    </div>
  )
}

export function AllPropertyListingGridSkeleton({count = 4}: PropertyGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2  mt-5">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyListingCardSkeleton key={i} />
      ))}
    </div>
  );
}