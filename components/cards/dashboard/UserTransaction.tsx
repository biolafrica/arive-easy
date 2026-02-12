'use client';

import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import { userTransactionStat } from "@/data/pages/dashboard/transaction";
import { StatsCard } from "./StatsCard";
import { useUserTransactionAnalytics } from "@/hooks/useSpecialized/useDashboard";
import StatCardSkeleton from "@/components/skeleton/StatCardSkeleton";


export function PaymentMortgageStats() {
  const {data, isLoading, error} = useUserTransactionAnalytics()

  if (error) {
    console.error('Transaction analytics error:', error);
  }

  return (

    <div className="mb-5">
      {isLoading && <StatCardSkeleton /> }

      {!isLoading && data && (
        <StatsGrid>
          {userTransactionStat(
            data.totalEscrow || 0, 
            data.pendingTransactions || 0, 
            data.totalSpent || 0
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
