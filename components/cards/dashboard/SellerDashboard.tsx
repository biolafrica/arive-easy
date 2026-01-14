import { StatsGrid } from "@/components/layouts/dashboard/StatGrid";
import { MOCK_SELLER_DASHBOARD_STATS } from "@/data/pages/dashboard/home";
import { StatsCard } from "./StatsCard";


export function SellerDashboadStats() {
  return (
    <div className="mb-5">
      <StatsGrid>
        {MOCK_SELLER_DASHBOARD_STATS.map((stat) => {
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
    </div>
  );
}