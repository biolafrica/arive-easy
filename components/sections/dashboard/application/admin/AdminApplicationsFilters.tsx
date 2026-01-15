import { FilterConfig } from "@/components/common/FilterDropdown";

export const adminPreApprovalConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    type: 'select', 
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'approved', label: 'Approved' },
      { value: 'pending', label: 'Submitted' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'draft', label: 'Draft' },
    ],
  },
  {
    key: 'current_step',
    label: 'Steps',
    placeholder: 'All Steps',
    type: 'select', 
    options: [
      { value: '', label: 'All Steps' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
      { value: '5', label: '5' }, 
    ],
  },
];

export const adminApplicationConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    type: 'select', 
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'draft', label: 'Draft' },
    ],
  },
  {
    key: 'stages',
    label: 'Stages',
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