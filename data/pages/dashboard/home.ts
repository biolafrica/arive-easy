import { StatusConfig, TableColumn } from "@/components/table/DataTable";
import {formatDate, formatUSD } from "@/lib/formatter";
import { ApplicationBase, } from "@/type/pages/dashboard/application";
import { MortgagePaymentRPCData } from "@/type/pages/dashboard/mortgage";
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";
import { LockClosedIcon, HomeModernIcon, FolderIcon, } from '@heroicons/react/24/outline';

export const columns: TableColumn<ApplicationBase>[] = [
  { key: 'application_number', header: 'Application ID', sortable: true,},
  { key: 'property_name', header: 'Property Name', sortable: true, accessor:(row)=>row.properties.title},
  { key: 'current_stage', header: 'Current Step', sortable: false, accessor: (row) => humanizeSnakeCase(row.current_stage)},
  { key: 'progress', header: 'Progress', sortable: false, accessor:(row)=>getStagePercentage(row.current_stage)},
];

export const mortgagePayColumns: TableColumn<MortgagePaymentRPCData>[] = [
  { key: 'mortgage_number', header: 'Mortgage Number', sortable: false},
  { key: 'payment_number', header: 'Payment Number', sortable: true},
  { key: 'user_name', header: 'User Name', sortable: false},
  { key: 'amount', header: 'Amount', sortable: false, accessor:(row)=>formatUSD({amount:row.amount})},
  { key: 'due_date', header: 'Due Date', sortable: false},
  { key: 'paid_at', header: 'Paid At', sortable: false, accessor:(row)=> formatDate(row.paid_at || '') || 'Not yet'},
 
];

export const MPstatusConfig: StatusConfig[] = [
  { value: 'scheduled', label: 'Scheduled', variant: 'yellow' },
  { value: 'succeeded', label: 'Succeeded', variant: 'green' },
  { value: 'failed', label: 'Failed', variant: 'red' },
  { value: 'processing', label: 'Processing', variant: 'blue' },
];

export const statusConfig: StatusConfig[] = [
  { value: 'active', label: 'Active', variant: 'green' },
  { value: 'in_progress', label: 'Pending', variant: 'yellow' },
  { value: 'rejected', label: 'Inactive', variant: 'red' },
  { value: 'completed', label: 'Verified', variant: 'blue' },
];


export const getStagePercentage = (stage:string): string => {
  switch (stage) {
    case 'identity_verification':
      return '15%'
    case 'property_selection':
      return '25%'
    case 'terms_agreement':
      return '45%'
    case 'payment_setup':
      return '50%'
    case 'terms_agreement':
      return '65%'
    case 'payment_setup':
      return '80%'
    case 'mortgage_activation':
      return '100%'
    default:
      return '10%';
  }
  
};

export const PRE_APPROVAL_UI_CONFIG = {
  not_started: {
    tone: 'neutral',
    title: 'No application in progress',
    description:
      'Ready to get pre-approved? Start your mortgage application with Kletch and get pre-approved in as little as 48 hours.',
    primaryAction: 'Get Pre-approved',
    primaryButtonAction: '/application/pre-approval'
  },

  incomplete: {
    tone: 'warning',
    title: 'Your pre-approval is incomplete',
    description:
      "You're yet to complete your pre-approval. Finish your application to unlock property access and lender review.",
    primaryAction: 'Continue Pre-approval',
  },

  under_review: {
    tone: 'info',
    title: 'Application under review',
    description:
      "Your pre-approval application is currently being reviewed. We'll notify you once a decision has been made.",
    primaryAction: 'Check Applocation Status',
  },

  approved: {
    tone: 'success',
    title: "You're pre-approved",
    description:
      "You're pre-approved up to the amount below. Click below to proceed with your full mortgage application.",
    primaryAction: 'Continue to application',
  },

  approved_with_conditions: {
    tone: 'info',
    title: 'Pre-approved with conditions',
    description:
      "You're pre-approved, subject to the conditions listed below. Please Click below to proceed with your full mortgage application.",
    primaryAction: 'Continue to application',
  },

  rejected_with_guidance: {
    tone: 'error',
    title: 'Not pre-approved yet',
    description:
      "You're not pre-approved at this time. See guidance below to improve your chances.",
    primaryAction: 'Fix issues & re-apply',
  },

  expired: {
    tone: 'warning',
    title: 'Pre-approval expired',
    description:
      'Your pre-approval has expired after 3 months. Please apply again IF you need to apply for new mortgage.',
    primaryAction: 'Get new pre-approval',
  }
} as const;

export const buyerDashboardStat=(
  application:number, property:number, balance:number
)=>{
  return[
    { 
      id: 'application', title: 'All Application',
      value: application, icon: FolderIcon,
    },
    {
      id: 'property', title: 'Property Owned',
      value: property, icon: HomeModernIcon,
    },
    {
      id: 'balance', title: 'Escrow Balance',
      value: formatUSD({amount: balance, fromCents:true}),  icon: LockClosedIcon,
    },
  ]
}

export const sellerDashboardStat=(
  offer:number, listing:number, balance:number
)=>{
  return[
  {
    id: 'offers', title: ' Total Offers',
    value: offer, icon: FolderIcon,
  },
  {
    id: 'listing', title: 'Active Listings',
    value: listing, icon: HomeModernIcon,
  },
  {
    id: 'balance', title: 'Escrow Balance',
    value: formatUSD({amount:balance, fromCents:true}), icon: LockClosedIcon,
  },
  ]
}



