export interface SellerDashboardAnalytics {
  totalPendingOffers: number;
  activeListings: number;
  totalEscrowBalance: number;
  escrowTransactionCount: number;
}

export interface UserDashboardAnalytics {
  totalApplications: number;
  propertiesOwned: number;
  totalTransactions: number;
  totalDownPayments: number;
}

export interface UserTransactionAnalytics {
  totalEscrow: number; 
  pendingTransactions: number; 
  totalSpent: number; 
}

export type SellerTransactionAnalytics = {
  totalEscrow: number; 
  totalRevenue: number; 
  pendingRevenue: number; 
}

export interface AdminDashboardAnalytics {
  totalApprovals: number;
  draftApprovals: number;
  approvedApprovals: number;
  pendingApprovals: number;

  totalApplications: number;
  inProgressApplications: number;
  activeApplications: number;
  rejectedApplications: number;

  totalDocumentTransactions: number;
  staticDocumentTransactions: number;
  dynamicDocumentTransactions: number;
  partialDynamicDocumentTransactions:number

  totalPartnerDocuments: number;
  bankPartnerDocuments: number;
  sellerPartnerDocuments: number;
  activeBankPartnerDocuments:number;

  totalDocumentTemplates: number;
  activeDocumentTemplates: number;
  inactiveDocumentTemplates: number;
  archivedDocumentTemplates:number;

  totalUsers: number;
  adminUsers: number;
  sellerUsers: number;
  regularUsers: number;

  totalProperties: number;
  activeProperties: number;
  inactiveProperties: number;
  featuredProperties: number;

  totalMortgages: number;
  activeMortgages: number;
  completedMortgages: number;
  cancelledMortgages: number;

  totalTransactionAmount: number;
  succeededTransactionAmount: number;
  pendingTransactionAmount: number;
  failedTransactionAmount: number;
}

export type AdminStatSection =
  | 'pre-approvals'
  | 'applications'
  | 'transactional-documents'
  | 'partner-documents'
  | 'document-templates'
  | 'users'
  | 'properties'
  | 'mortgages'
  | 'transactions'
  | 'home';

export interface AdminDashboardStatsProps {
  section?: AdminStatSection; 
}

