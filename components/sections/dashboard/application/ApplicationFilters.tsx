import { FilterConfig } from "@/components/common/TableFilter";


export const applicationFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'completed', label: 'Completed' },
    ],
  },
  {
    key: 'current_stage',
    label: 'Current Stage',
    placeholder: 'All Stages',
    options: [
      { value: '', label: 'All Stages' },
      { value: 'property_selection', label: 'Property Selection' },
      { value: 'identity_verification', label: 'Identity Verification' },
      { value: 'seller_review', label: 'Seller Review' },
      { value: 'bank_underwriting', label: 'Bank Underwriting' },
      { value: 'terms_agreement', label: 'Terms Agreement' },
      { value: 'payment_setup', label: 'Payment Setup' },
      { value: 'down_payment', label: 'Down Payment' },
      { value: 'active', label: 'Active' },
    ],
  },
];