import { StatusConfig, TableColumn } from "@/components/common/DataTable";
import { formatNumberDate, formatUSD } from "@/lib/formatter";
import { PropertyBase } from "@/type/pages/property";

export const columns: TableColumn<PropertyBase>[] = [
  { key: 'id', header: 'Property ID', sortable: false},
  { key: 'title', header: 'Title', sortable: false},
  { key: 'price', header: 'Price', sortable: false, accessor: (row) => formatUSD({ amount: Number(row.price), fromCents: false, decimals: 2 })},  
  { key: 'created_at', header: 'Date', sortable: false, accessor: (row) => formatNumberDate(row.created_at)},
  { key: 'user', header: 'Developer', sortable: false, accessor: (row) => row.users?.name},
  { key: 'property_type', header: 'Type', sortable: false },

];

export const statusConfig: StatusConfig[] = [
  { value: 'active', label: 'Active', variant: 'green' },
  { value: 'inprogress', label: 'In Progress', variant: 'yellow' },
  { value: 'inactive', label: 'Inactive', variant: 'red' },
  { value: 'draft', label: 'Draft', variant: 'yellow' },
  { value: 'withdrawn', label: 'Withdrawn', variant: 'red' },
  { value: 'offers', label: 'Offers', variant: 'yellow' },
  { value: 'reserved', label: 'Reserved', variant: 'yellow' },
  { value: 'sold', label: 'Sold', variant: 'green' },
  { value: 'paused', label: 'Paused', variant: 'blue' },

];


export const confirmConfig = {
  approval: {
    title: 'Approval',
    message: 'Are you sure you want to update approval?',
    variant: 'warning',
  },
  feature: {
    title: 'Feature',
    message: 'Are you sure you want to update feature?',
    variant: 'warning',
  },
} as const;



