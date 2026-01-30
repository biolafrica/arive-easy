import { StatusConfig, TableColumn } from "@/components/common/DataTable";
import { formatDate, formatUSD } from "@/lib/formatter";
import { FormField } from "@/type/form";
import { ApplicationBase, ApplicationStage, MockApplications} from "@/type/pages/dashboard/application";
import {ClockIcon, CheckCircleIcon, XCircleIcon} from '@heroicons/react/24/outline';

export const APPLICATION_STAGES: ApplicationStage[] = [
  {
    step: 1,
    key: 'personal_details',
    title: 'Personal Details',
    status: 'completed',
    completedAt: '2025-01-04',
  },
  {
    step: 2,
    key: 'employment_income',
    title: 'Employment & Income',
    status: 'rejected',
    errorMessage:
      'We need additional income verification documents to proceed.',
  },
  {
    step: 3,
    key: 'property_details',
    title: 'Property Details',
    status: 'current',
  },
  {
    step: 4,
    key: 'documents',
    title: 'Document Uploads',
    status: 'upcoming',
  },
];

export const columns: TableColumn<ApplicationBase>[] = [
  { key: 'application_number', header: 'Approval ID', sortable: false},
  { key: 'property', header: 'Property', sortable: false, accessor: (row) => row.properties?.title || 'ongoing'},
  { key: 'current_stage', header: 'Current stage', sortable: false,},
  { key: 'created_at', header: 'Date Created', sortable: false, accessor: (row) => formatDate(row.created_at)},
];

export const statusConfig: StatusConfig[] = [
  { value: 'in_progress', label: 'In Progress', variant: 'yellow' },
  { value: 'rejected', label: 'Rejected', variant: 'red' },
  { value: 'completed', label: 'Draft', variant: 'green' },
];

export const MOCK_DATA: MockApplications[] = [
  {
    id: "PA-1001",
    property_id: "PR-2001",
    application_number: "APP-3001",
    current_stage: "Identity Verification",
    created_at: "2024-05-01T10:15:30Z",
    properties: {
      title: "123 Maple Street",
      address: "123 Maple Street, Springfield, IL",
    },
    status: "draft",
    updated_at: "2024-05-02T12:00:00Z",
  },
  {
    id: "PA-1002",
    property_id: "PR-2002",
    application_number: "APP-3002",
    current_stage: "Mortgage Activation",
    created_at: "2024-05-03T11:20:45Z",
    properties: {
      title: "456 Oak Avenue",
      address: "456 Oak Avenue, Lincoln, NE",
    },
    status: "approved",
    updated_at: "2024-05-04T13:30:00Z",
  }
   
];

export function usePreApplications(queryParams?: Record<string, any>) {
  return {
    applications:MOCK_DATA,
    isLoading: false,
  }
}


export const STATUS_CONFIG = {
  pending: {
    icon: ClockIcon,
    container: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-500',
    title: 'Awaiting Seller Review',
    titleColor: 'text-blue-900',
    textColor: 'text-blue-700',
    defaultMessage: (propertyName: string) =>
      `Your selection for ${propertyName} has been sent to the seller for review. You’ll be notified once they respond.`,
  },

  approved: {
    icon: CheckCircleIcon,
    container: 'bg-green-50 border-green-200',
    iconColor: 'text-green-500',
    title: 'Property Approved!',
    titleColor: 'text-green-900',
    textColor: 'text-green-700',
    defaultMessage: (propertyName: string) =>
      `Great news! The seller has approved your selection for ${propertyName}. You can now proceed to the next step.`,
  },

  declined: {
    icon: XCircleIcon,
    container: 'bg-red-50 border-red-200',
    iconColor: 'text-red-500',
    title: 'Property Selection Declined',
    titleColor: 'text-red-900',
    textColor: 'text-red-700',
    defaultMessage: (propertyName: string) =>
      `Unfortunately, your selection for ${propertyName} was declined.`,
  },
} as const;


export const downPaymentField:FormField[]=[
  {name: 'down_payment', label:"Down Payment", type:'text', required:true , placeholder:"Enter Amount"}
]

export interface DownPaymentForm{
  down_payment:string
}

export const downPaymentInitialValue:DownPaymentForm ={
  down_payment: formatUSD({amount:0, fromCents:false, decimals:2})
}

