import { formatUSD } from "@/lib/formatter";
import { AdminDashboardAnalytics } from "@/type/pages/dashboard/analytics";
import * as icon from "@heroicons/react/24/outline";

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
  archivedDocumentTemplates:0,

  totalPartnerDocuments: 0,
  bankPartnerDocuments: 0,
  sellerPartnerDocuments: 0,
  activeBankPartnerDocuments:0,

  totalDocumentTemplates: 0,
  activeDocumentTemplates: 0,
  inactiveDocumentTemplates: 0,
  partialDynamicDocumentTransactions:0,

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

export const adminApprovalStats = (d: AdminDashboardAnalytics) => [
  { id: 'total',    title: 'Total Approvals',   value: d.totalApprovals,    icon: icon.ClipboardDocumentCheckIcon },
  { id: 'approved', title: 'Approved',           value: d.approvedApprovals, icon: icon.CheckCircleIcon },
  { id: 'pending',  title: 'Awaiting Approval',  value: d.pendingApprovals,  icon: icon.ClockIcon },
  { id: 'draft',    title: 'Draft',              value: d.draftApprovals,    icon: icon.DocumentTextIcon },
];

export const adminApplicationStats = (d: AdminDashboardAnalytics) => [
  { id: 'total',       title: 'Total Applications', value: d.totalApplications,      icon: icon.FolderOpenIcon },
  { id: 'active',      title: 'Active',             value: d.activeApplications,     icon: icon.CheckCircleIcon },
  { id: 'in_progress', title: 'In Progress',        value: d.inProgressApplications, icon: icon.ClockIcon },
  { id: 'rejected',    title: 'Rejected',           value: d.rejectedApplications,   icon: icon.XCircleIcon },
];

export const adminDocTransactionStats = (d: AdminDashboardAnalytics) => [
  { id: 'total',   title: 'Total Doc Transactions', value: d.totalDocumentTransactions,   icon: icon.DocumentDuplicateIcon },
  { id: 'static',  title: 'Static (PDF)',           value: d.staticDocumentTransactions,  icon: icon.DocumentTextIcon },
  { id: 'dynamic', title: 'Dynamic (Anvil)',        value: d.dynamicDocumentTransactions, icon: icon.LinkIcon },
  { id: 'partial_dynamic', title: 'Partial Dynamic',        value: d.partialDynamicDocumentTransactions, icon: icon.LinkIcon },
];

export const adminPartnerDocStats = (d: AdminDashboardAnalytics) => [
  { id: 'total',  title: 'Total Partner Docs', value: d.totalPartnerDocuments,  icon: icon.FolderOpenIcon },
  { id: 'bank',   title: 'Bank Documents',     value: d.bankPartnerDocuments,   icon: icon.BuildingLibraryIcon },
  { id: 'seller', title: 'Seller Documents',   value: d.sellerPartnerDocuments, icon: icon.TagIcon },
  { id: 'active_bank', title: 'Active Bank Doc',   value: d.activeBankPartnerDocuments, icon: icon.BuildingLibraryIcon },
];

export const adminTemplateStats = (d: AdminDashboardAnalytics) => [
  { id: 'total',    title: 'Total Templates',    value: d.totalDocumentTemplates,    icon: icon.DocumentDuplicateIcon },
  { id: 'active',   title: 'Active Templates',   value: d.activeDocumentTemplates,   icon: icon.CheckCircleIcon },
  { id: 'inactive', title: 'Inactive Templates', value: d.inactiveDocumentTemplates, icon: icon.XCircleIcon },
  { id: 'archived', title: 'Archived Templates', value: d.archivedDocumentTemplates, icon: icon.XCircleIcon },
];

export const adminUserStats = (d: AdminDashboardAnalytics) => [
  { id: 'total',  title: 'Total Users', value: d.totalUsers,   icon: icon.UsersIcon },
  { id: 'user',   title: 'Buyers',      value: d.regularUsers, icon: icon.UserIcon },
  { id: 'seller', title: 'Sellers',     value: d.sellerUsers,  icon: icon.UserGroupIcon },
  { id: 'admin',  title: 'Admins',      value: d.adminUsers,   icon: icon.ShieldExclamationIcon },
];

export const adminPropertyStats = (d: AdminDashboardAnalytics) => [
  { id: 'total',    title: 'Total Properties',    value: d.totalProperties,    icon: icon.BuildingOffice2Icon },
  { id: 'active',   title: 'Active',              value: d.activeProperties,   icon: icon.CheckCircleIcon },
  { id: 'inactive', title: 'Inactive',            value: d.inactiveProperties, icon: icon.XCircleIcon },
  { id: 'featured', title: 'Featured',            value: d.featuredProperties, icon: icon.HomeModernIcon },
];

export const adminMortgageStats = (d: AdminDashboardAnalytics) => [
  { id: 'total',     title: 'Total Mortgages',     value: d.totalMortgages,     icon: icon.ShieldCheckIcon },
  { id: 'active',    title: 'Active',              value: d.activeMortgages,    icon: icon.CheckCircleIcon },
  { id: 'completed', title: 'Completed',           value: d.completedMortgages, icon: icon.CubeIcon },
  { id: 'cancelled', title: 'Cancelled',           value: d.cancelledMortgages, icon: icon.XCircleIcon },
];

export const adminTransactionStats = (d: AdminDashboardAnalytics) => [
  { id: 'total',     title: 'Total Volume',    value: formatUSD({ amount: d.totalTransactionAmount,     fromCents: true }), icon: icon.BanknotesIcon },
  { id: 'succeeded', title: 'Successful',      value: formatUSD({ amount: d.succeededTransactionAmount, fromCents: true }), icon: icon.CheckCircleIcon },
  { id: 'pending',   title: 'Pending',         value: formatUSD({ amount: d.pendingTransactionAmount,   fromCents: true }), icon: icon.ClockIcon },
  { id: 'failed',    title: 'Failed',          value: formatUSD({ amount: d.failedTransactionAmount,    fromCents: true }), icon: icon.XCircleIcon },
];

export const adminHomeStats = (d: AdminDashboardAnalytics) => [
  { id: 'total_approvals',title: 'Total Approvals', value: d.totalApprovals, icon: icon.ClipboardDocumentCheckIcon },
  { id: 'total_applications',title: 'Total Applications', value: d.totalApplications, icon: icon.FolderOpenIcon },
  { id: 'total_doc_trans',title: 'Total Doc Transactions', value: d.totalDocumentTransactions, icon: icon.DocumentDuplicateIcon },
  { id: 'total_templates',title: 'Total Templates', value: d.totalDocumentTemplates, icon: icon.DocumentDuplicateIcon },
  { id: 'total_users', title: 'Total Users', value: d.totalUsers, icon: icon.UsersIcon },
  { id: 'total_properties', title: 'Total Properties', value: d.totalProperties, icon: icon.BuildingOffice2Icon },
  { id: 'total_mortgages', title: 'Total Mortgages', value: d.totalMortgages, icon: icon.ShieldCheckIcon },
  { id: 'total_volume', title: 'Total Volume', value: formatUSD({ amount: d.totalTransactionAmount,fromCents: true }), icon: icon.BanknotesIcon },
];
