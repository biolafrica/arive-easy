import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import { MOCK_MORTGAGE_STATS } from "@/data/pages/dashboard/transaction";
import { StatsCard } from "./StatsCard";


export function PaymentMortgageStats() {
  return (
    <StatsGrid>
      {MOCK_MORTGAGE_STATS.map((stat) => {
        const Icon = stat.icon;

        return (
          <StatsCard
            key={stat.id}
            icon={<Icon className="h-6 w-6" />}
            title={stat.title}
            value={stat.value}
            subText={stat.subText}
          />
        );
      })}
    </StatsGrid>
  );
}
