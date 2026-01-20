import { FilterConfig } from "@/components/common/FilterDropdown";

export const adminPropertyFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    type: 'select', 
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'In Active' },
      { value: 'inprogress', label: 'In Progress' },
      { value: 'draft', label: 'Draft' },
      { value: 'withdrawn', label: 'Withdrawn' },
      { value: 'offers', label: 'Offers' },
      { value: 'reseved', label: 'Reserved' },
      { value: 'sold', label: 'Sold' },
      { value: 'paused', label: 'Paused' },
    ],
  },
  {
    key: 'property_type',
    label: 'Type',
    placeholder: 'All Types',
    type: 'select', 
    options: [
      { value: '', label: 'All Type' },
      { value: 'apartment', label: 'Apartment' },
      { value: 'detached_house', label: 'Detached House' },
      { value: 'semi_detached', label: 'Semi Detached' },
      { value: 'terrace', label: 'Terrace' },
      { value: 'land', label: 'Land' },
    ],
  },
];