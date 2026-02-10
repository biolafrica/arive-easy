import { StatsGrid } from "../layouts/dashboard/StatGrid";

export default function StatCardSkeleton() {
  return(
    <div className="mb-5">
      <StatsGrid>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg" />
        ))}
      </StatsGrid>
    </div>
  )
}