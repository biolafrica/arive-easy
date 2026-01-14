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
      { value: 'in_active', label: 'In-Active' },
      { value: 'in_progress', label: 'In-Progress' },
      { value: 'acquired', label: 'Acquired' },
    ],
  },
  {
    key: 'type',
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