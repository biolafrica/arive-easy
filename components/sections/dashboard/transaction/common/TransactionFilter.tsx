import { FilterConfig } from "@/components/common/FilterDropdown";


const statusOptions:FilterConfig = {
  key: 'status',
  label: 'Status',
  placeholder: 'All Statuses',
  type: 'select', 
  options: [
    { value: '', label: 'All Statuses' },
    { value: 'succeeded', label: 'Success' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' },
  ],
}

const typeOptions:FilterConfig = {
  key: 'type',
  label: 'Type',
  placeholder: 'All Types',
  type: 'select', 
  options: [
    { value: '', label: 'All Types' },
    { value: 'escrow', label: 'Escrow' },
    { value: 'processing_fee', label: 'Processing' },
    { value: 'valuation_fee', label: 'Valuation' },
    { value: 'legal_fee', label: 'Legal' },
    { value: 'service_fee', label: 'Service' },
  ],
}
  
export const sellerTransactionFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    type: 'select', 
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'succeeded', label: 'Credited' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Released' },
    ],
  },
];

export const adminTransactionFilterConfigs: FilterConfig[] = [
  statusOptions,
  typeOptions
];

export const transactionFilterConfigs: FilterConfig[] = [
  statusOptions,
  typeOptions
]
