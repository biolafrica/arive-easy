import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import {sellerDashboardStat } from "@/data/pages/dashboard/home";
import { StatsCard } from "./StatsCard";
import { useSellerDashboardAnalytics } from "@/hooks/useSpecialized/useDashboard";
import StatCardSkeleton from "@/components/skeleton/StatCardSkeleton";


export function SellerDashboadStats() {
  const {data, isLoading, error} = useSellerDashboardAnalytics()

  if (error) {
    console.error('Dashboard analytics error:', error);
  }

  return (
    <div className="mb-5">
      {isLoading && <StatCardSkeleton /> }

      {!isLoading && data && (
        <StatsGrid>
          {sellerDashboardStat(
            data.totalPendingOffers|| 0,
            data.activeListings || 0,
            data.totalEscrowBalance || 0
          ).map((stat) => {
            const Icon = stat.icon;
            return (
              <StatsCard
                key={stat.id}
                icon={<Icon className="h-6 w-6" />}
                title={stat.title}
                value={stat.value}
              />
            );
          })}
        </StatsGrid>
      )}
    </div>
  );
}