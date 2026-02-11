import { FilterConfig } from "@/components/common/FilterDropdown";

const statusOptions:FilterConfig = {
  key: 'status',
  label: 'Status',
  placeholder: 'All Statuses',
  type: 'select', 
  options: [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ],
}

export const templateConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    type: 'select', 
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
     
    ],
  },
  {
    key: 'type',
    label: 'Type',
    placeholder: 'All Type',
    type: 'select', 
    options: [
      { value: '', label: 'All Steps' },
      { value: 'contract_of_sales', label: 'Contract Of Sales' },
      { value: 'mortgage_agreement', label: 'Mortgage Agreement' },
      { value: 'certificate_of_occupancy', label: 'Certificate Of Occupancy' },
      { value: 'title_deed', label: 'Title Deed' },
    ],
  },
];

export const partnerConfigs: FilterConfig[] = [
  statusOptions,
  {
    key: 'partner_type',
    label: 'Type',
    placeholder: 'All Type',
    type: 'select', 
    options: [
      { value: '', label: 'All Steps' },
      { value: 'seller', label: 'Seller' },
      { value: 'Bank', label: 'Bank' },
    ],
  },
];

export const sellerConfigs: FilterConfig[] = [
 statusOptions
];