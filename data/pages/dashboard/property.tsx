import { StatusConfig, TableColumn } from "@/components/common/DataTable";
import { formatNumberDate, formatUSD } from "@/lib/formatter";
import { MockPropertyBase } from "@/type/pages/dashboard/property";

export const columns: TableColumn<MockPropertyBase>[] = [
  { key: 'id', header: 'Property ID', sortable: false},
  { key: 'title', header: 'Title', sortable: false},
  { key: 'price', header: 'Price', sortable: false, accessor: (row) => formatUSD({ amount: Number(row.price), fromCents: false, decimals: 2 })},  
  { key: 'created_at', header: 'Date', sortable: false, accessor: (row) => formatNumberDate(row.created_at)},
  { key: 'user', header: 'Developer', sortable: false, accessor: (row) => row.users.name},
  { key: 'property_type', header: 'Type', sortable: false },

];

export const statusConfig: StatusConfig[] = [
  { value: 'acquired', label: 'Acquired', variant: 'green' },
  { value: 'in_progress', label: 'In Progress', variant: 'yellow' },
  { value: 'in_active', label: 'Inactive', variant: 'red' },
  { value: 'Active', label: 'Inactive', variant: 'blue' },
];

export const MOCK_DATA:MockPropertyBase[] = [
  {
    id: 'PR-101',
    developer_id: 'DEV-001',
    title: 'Modern Apartment in City Center',
    status: 'acquired',
    price: '350000',
    is_active: true,
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-02-16T12:00:00Z',
    property_type: 'Apartment',
    users: {
      name: 'John Doe',
      email: "john@example.com"
    }
  },
  {
    id: 'PR-102',
    developer_id: 'DEV-002',
    title: 'Cozy Suburban House',
    status: 'in_progress',
    price: '450000',
    is_active: true,
    created_at: '2023-03-20T14:45:00Z',
    updated_at: '2023-04-22T16:15:00Z',
    property_type: 'Semi Detached',
    users: {
      name: 'Jane Smith',
      email: 'jane@kletch.com'
    }
  }

]

export function useAdminProperty(queryParams?: Record<string, any>) {
  return {
    properties:MOCK_DATA,
    isLoading: false,
  }
};


