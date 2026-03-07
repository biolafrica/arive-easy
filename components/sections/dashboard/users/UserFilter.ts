import { FilterConfig } from "@/components/table/FilterDropdown";

export const userFilterConfigs: FilterConfig[] = [

  {
    key: 'role',
    label: 'Role',
    placeholder: 'All User Roles',
    type: 'select',
    options: [
      { value: '', label: 'All Roles' },
      { value: 'user', label: 'User' },
      { value: 'seller', label: 'Seller' },
      { value: 'admin', label: 'Admin' },
    ],
  },
];