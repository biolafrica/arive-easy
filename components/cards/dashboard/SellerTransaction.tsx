'use client'

import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import { StatsCard } from "./StatsCard";
import { sellerTransactionStat } from "@/data/pages/dashboard/transaction";
import { useSellerTransactionAnalytics } from "@/hooks/useSpecialized/useDashboard";
import StatCardSkeleton from "@/components/skeleton/StatCardSkeleton";


export function SellerTransactionStats() {
  const {data, isLoading, error} = useSellerTransactionAnalytics()

  if (error) {
    console.error('Transaction analytics error:', error);
  }

  return (
    <div className="mb-5">
      {isLoading && <StatCardSkeleton /> }

      {!isLoading && data && (
        <StatsGrid>
          {sellerTransactionStat(
            data.totalEscrow || 0, 
            data.totalRevenue || 0, 
            data.pendingRevenue || 0
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