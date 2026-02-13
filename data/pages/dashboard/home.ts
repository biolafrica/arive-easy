import { StatusConfig, TableColumn } from "@/components/common/DataTable";
import {formatUSD } from "@/lib/formatter";
import { ApplicationBase, } from "@/type/pages/dashboard/application";
import { LockClosedIcon, HomeModernIcon, FolderIcon, } from '@heroicons/react/24/outline';
  

export const columns: TableColumn<ApplicationBase>[] = [
  { key: 'application_number', header: 'Application ID', sortable: true,},
  { key: 'property_name', header: 'Property Name', sortable: true, accessor:(row)=>row.properties.title},
  { key: 'current_stage', header: 'Current Step', sortable: false},
  { key: 'progress', header: 'Progress', sortable: false, accessor:(row)=>getStagePercentage(row.current_stage)},
];

export const statusConfig: StatusConfig[] = [
  { value: 'active', label: 'Active', variant: 'green' },
  { value: 'in_progress', label: 'Pending', variant: 'yellow' },
  { value: 'rejected', label: 'Inactive', variant: 'red' },
  { value: 'completed', label: 'Verified', variant: 'blue' },
];


export const getStagePercentage = (stage:string): string => {
  switch (stage) {
    case 'property_selection':
      return '15%'
    case 'identity_verification':
      return '25%'
    case 'seller_review':
      return '45%'
    case 'bank_underwriting':
      return '50%'
    case 'terms_agreement':
      return '65%'
    case 'payment_setup':
      return '80%'
    case 'down_payment':
      return '90%'
    case 'active':
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
      'Ready to get pre-approved? Start your mortgage application with Ariveasy and get pre-approved in as little as 48 hours.',
    primaryAction: 'Get Pre-approved',
    primaryButtonAction: '/application/pre-approval'
  },

  incomplete: {
    tone: 'warning',
    title: 'Your pre-approval is incomplete',
    description:
      "You're yet to complete your pre-approval. Finish your application to unlock property access and lender review.",
    primaryAction: 'Continue application',
  },

  under_review: {
    tone: 'info',
    title: 'Application under review',
    description:
      "Your pre-approval application is currently being reviewed. We'll notify you once a decision has been made.",
    primaryAction: 'View status',
  },

  approved: {
    tone: 'success',
    title: "You're pre-approved",
    description:
      "You're pre-approved up to the amount below. Click below to proceed with your full mortgage application.",
    primaryAction: 'Create application',
  },

  approved_with_conditions: {
    tone: 'info',
    title: 'Pre-approved with conditions',
    description:
      "You're pre-approved, subject to the conditions listed below. Please address these conditions in your application.",
    primaryAction: 'Fix conditions & apply',
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
      'Your pre-approval has expired after 3 months. Please apply again to get an updated pre-approval.',
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



