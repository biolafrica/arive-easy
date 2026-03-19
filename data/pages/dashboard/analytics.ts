import { AdminDashboardAnalytics } from "@/type/pages/dashboard/analytics";

export const ADMIN_ANALYTICS_FALLBACK: AdminDashboardAnalytics = {
  totalApprovals: 0,
  draftApprovals: 0,
  approvedApprovals: 0,
  pendingApprovals: 0,

  totalApplications: 0,
  inProgressApplications: 0,
  activeApplications: 0,
  rejectedApplications: 0,

  totalDocumentTransactions: 0,
  staticDocumentTransactions: 0,
  dynamicDocumentTransactions: 0,

  totalPartnerDocuments: 0,
  bankPartnerDocuments: 0,
  sellerPartnerDocuments: 0,

  totalDocumentTemplates: 0,
  activeDocumentTemplates: 0,
  inactiveDocumentTemplates: 0,

  totalUsers: 0,
  adminUsers: 0,
  sellerUsers: 0,
  regularUsers: 0,

  totalProperties: 0,
  activeProperties: 0,
  inactiveProperties: 0,
  featuredProperties: 0,

  totalMortgages: 0,
  activeMortgages: 0,
  completedMortgages: 0,
  cancelledMortgages: 0,

  totalTransactionAmount: 0,
  succeededTransactionAmount: 0,
  pendingTransactionAmount: 0,
  failedTransactionAmount: 0,
};
