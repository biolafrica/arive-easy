
export function MortgageCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
        <div className="h-7 w-28 bg-gray-200 rounded-full" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between mb-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-2 bg-gray-200 rounded-full" />
        <div className="flex justify-between mt-2">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-28 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
        <div className="space-y-2 flex flex-col items-end">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="mt-6">
        <div className="h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export function MortgageDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="h-7 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="h-4 w-48 bg-gray-200 rounded mt-2" />
          <div className="flex gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-28 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-6 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded-full mb-4" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}