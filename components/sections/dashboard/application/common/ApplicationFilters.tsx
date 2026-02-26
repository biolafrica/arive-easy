import { FilterConfig } from '@/components/common/FilterDropdown';

export const applicationFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    type: 'select', 
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'active', label: 'Completed' },
    ],
  },
  {
    key: 'current_stage',
    label: 'Current Stage',
    placeholder: 'All Stages',
    type: 'select',
    options: [
      { value: '', label: 'All Stages' },
      { value: 'identity_verification', label: 'Verification' },
      { value: 'property_selection', label: 'Property' },
      { value: 'terms_agreement', label: 'Terms' },
      { value: 'payment_setup', label: 'Payment' },
      { value: 'mortgage_activation', label: 'Mortgage' },
    ],
  },
];