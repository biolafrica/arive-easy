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

