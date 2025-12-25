import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import { MOCK_BUYER_DASHBOARD_STATS} from "@/data/pages/dashboard/transaction";
import { StatsCard } from "./StatsCard";


export function UserDashboadStats() {
  return (
    <StatsGrid>
      {MOCK_BUYER_DASHBOARD_STATS.map((stat) => {
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