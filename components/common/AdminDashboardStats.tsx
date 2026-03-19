import { useAdminDashboardAnalytics } from '@/hooks/useSpecialized/useDashboard';
import {
  adminApprovalStats,
  adminApplicationStats,
  adminDocTransactionStats,
  adminPartnerDocStats,
  adminTemplateStats,
  adminUserStats,
  adminPropertyStats,
  adminMortgageStats,
  adminTransactionStats,
  adminHomeStats,
} from '@/data/pages/dashboard/analytics';

import StatCardSkeleton from '../skeleton/StatCardSkeleton';
import { AdminStatsSection, StatDef } from '../cards/dashboard/AdminStatsCard';
import { AdminDashboardStatsProps, AdminStatSection } from '@/type/pages/dashboard/analytics';


export function AdminDashboardStats({ section }: AdminDashboardStatsProps) {
  const { data, isLoading, isFetching, error } = useAdminDashboardAnalytics();

  if (error) console.error('Admin analytics error:', error);

  if (!data) {
    return (
      <div className="mb-8">
        <StatCardSkeleton />
      </div>
    );
  }

  const allSections: Record<AdminStatSection, { title: string; stats: StatDef[] }> = {
    'pre-approvals':  { title: 'Pre-Approvals',  stats: adminApprovalStats(data) },
    'applications':  { title: 'Applications',  stats: adminApplicationStats(data) },
    'transactional-documents':{ title: 'Transactional Documents', stats: adminDocTransactionStats(data) },
    'partner-documents':  { title: 'Partner Documents', stats: adminPartnerDocStats(data) },
    'document-templates': { title: 'Document Templates', stats: adminTemplateStats(data) },
    'users': { title: 'Users', stats: adminUserStats(data) },
    'properties': { title: 'Properties', stats: adminPropertyStats(data) },
    'mortgages': { title: 'Mortgages',  stats: adminMortgageStats(data) },
    'transactions': { title: 'Transactions', stats: adminTransactionStats(data) },
    'home': { title: 'Dashboard', stats: adminHomeStats(data) },
  };

  const sectionsToRender = section
    ? [allSections[section]]
    : Object.values(allSections);

  return (
    <div>
      {sectionsToRender.map((s) => (
        <AdminStatsSection
          key={s.title}
          title={s.title}
          stats={s.stats}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      ))}
    </div>
  );
}