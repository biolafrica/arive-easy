import { FilterConfig } from "@/components/common/FilterDropdown";

export const offerFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    type: 'select', 
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'accepted', label: 'Success' },
      { value: 'pending', label: 'Pending' },
      { value: 'declined', label: 'Failed' },
 
    ],
  },
];