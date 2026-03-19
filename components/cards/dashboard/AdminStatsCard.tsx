import { AdminStatsGrid} from '@/components/layouts/dashboard/StatGrid';
import StatCardSkeleton from '@/components/skeleton/StatCardSkeleton';
import { StatsCard } from './StatsCard';

export interface StatDef {
  id: string;
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminStatsSectionProps {
  title: string;
  stats: StatDef[];
  isLoading: boolean;
  isFetching: boolean;
}

export function AdminStatsSection({
  title,
  stats,
  isLoading,
  isFetching,
}: AdminStatsSectionProps) {
  const showSkeleton = isLoading || isFetching;

  return (
    <div className="mb-8">
      <h3 className="mb-3 text-sm font-medium text-secondary uppercase tracking-wide">
        {title}
      </h3>

      {showSkeleton ? (
        <StatCardSkeleton />
      ) : (
        <AdminStatsGrid>
          {stats.map((stat) => {
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
        </AdminStatsGrid>
      )}
    </div>
  );
}