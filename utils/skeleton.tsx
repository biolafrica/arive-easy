export function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
    />
  );
}

export function HeaderSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-40 bg-gray-100 rounded-lg w-full" />
      <div className="h-40 bg-gray-100 rounded-lg w-3/4" />
      <div className="h-40 bg-gray-100 rounded-lg w-2/4" />
      <div className="h-40 bg-gray-100 rounded-lg w-1/4" />
    </div>
  );

}
   
