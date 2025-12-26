import { StatusConfig, TableColumn } from "@/components/common/DataTable";

interface Transactiontype{
  application_id : string;
  property_name : string;
  current_step: string;
  progress : string;
}

export const columns: TableColumn<Transactiontype>[] = [
  { key: 'application_id', header: 'Application ID', sortable: true,},
  { key: 'property_name', header: 'Property Name', sortable: true},
  { key: 'current_step', header: 'Current Step', sortable: false},
  { key: 'progress', header: 'Progress', sortable: false},
];

export const statusConfig: StatusConfig[] = [
  { value: 'active', label: 'Active', variant: 'green' },
  { value: 'pending', label: 'Pending', variant: 'yellow' },
  { value: 'inactive', label: 'Inactive', variant: 'red' },
  { value: 'verified', label: 'Verified', variant: 'blue' },
];

export const data = [
  { id: '1', application_id:'APP-001', property_name:'Maplewood Garden', current_step: 'Pre Approval', progress: '50%', status:'pending'},
  { id: '2', application_id:'APP-002', property_name:'Mary Keyes Residence', current_step: 'Application', progress: '100%', status:'active'},
  { id: '3', application_id:'APP-003', property_name:'Sunnyvale Heights', current_step: 'Financing', progress: '80%', status:'inactive'},
  { id: '4', application_id:'APP-004', property_name:'Cedar Point Retreat', current_step: 'Credit Check', progress: '70%', status:'verified'},
];

export const PRE_APPROVAL_UI_CONFIG = {
  not_started: {
    tone: 'neutral',
    title: 'No application in progress',
    description:
      'Ready to get pre-approved? Start your mortgage application with Ariveasy and get pre-approved in as little as 48 hours.',
    primaryAction: 'Get Pre-approved',
  },

  incomplete: {
    tone: 'warning',
    title: 'Your pre-approval is incomplete',
    description:
      'You’re yet to complete your pre-approval. Finish your application to unlock property access and lender review.',
    primaryAction: 'Continue application',
  },

  approved: {
    tone: 'success',
    title: 'You’re pre-approved',
    description:
      'You’re pre-approved up to the amount below, subject to final checks.',
    primaryAction: 'Create application',
  },

  approved_with_conditions: {
    tone: 'info',
    title: 'Pre-approved with conditions',
    description:
      'You’re pre-approved, subject to the conditions listed below. You may proceed.',
    primaryAction: 'View conditions',
  },

  rejected_with_guidance: {
    tone: 'error',
    title: 'Not pre-approved yet',
    description:
      'You’re not pre-approved at this time. See guidance below to improve your chances.',
    primaryAction: 'Improve eligibility',
  },
  
} as const;
