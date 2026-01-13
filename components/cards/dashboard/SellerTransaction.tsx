import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import { StatsCard } from "./StatsCard";
import { MOCK_SELLER_TRANSACTION_STATS } from "@/data/pages/dashboard/transaction";


export function SellerTransactionStats() {
  return (
    <StatsGrid>
      {MOCK_SELLER_TRANSACTION_STATS.map((stat) => {
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
  );
}