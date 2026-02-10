'use client'

import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import { buyerDashboardStat} from "@/data/pages/dashboard/home";
import { StatsCard } from "./StatsCard";
import { useUserDashboardAnalytics } from "@/hooks/useSpecialized/useDashboard";
import StatCardSkeleton from "@/components/skeleton/StatCardSkeleton";


export function UserDashboadStats() {
  const {data, isLoading, error} = useUserDashboardAnalytics()
  console.log('User dashboard analytics data:', data);

  if (error) {
    console.error('Dashboard analytics error:', error);
  }

  return (
    <div className="mb-5">
      {isLoading && <StatCardSkeleton /> }

      {!isLoading && data && (
        <StatsGrid>
          {buyerDashboardStat(
            data.totalApplications || 0,
            data.propertiesOwned || 0,
            data.totalDownPayments || 0
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