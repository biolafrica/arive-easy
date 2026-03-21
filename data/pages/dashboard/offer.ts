import { StatusConfig, TableColumn } from "@/components/table/DataTable";
import { FilterConfig } from "@/components/table/FilterDropdown";
import { formatNumberDate, formatUSD, toNumber } from "@/lib/formatter";
import { OfferBase} from "@/type/pages/dashboard/offer";

export const columns: TableColumn<OfferBase>[] = [
  { key: 'property_name', header: 'Property', sortable: false},
  { key: 'buyer', header: 'Buyer', sortable: false, accessor: (row) => row.users?.name},
  { key: 'created_at', header: 'Date', sortable: false, accessor: (row) => formatNumberDate(row.created_at)},
  {key:'amount', header:'Offer Amount', sortable:false, accessor:(row) => formatUSD({ amount: toNumber(row.amount), fromCents: false, decimals: 0 })},
];

export const statusConfig: StatusConfig[] = [
  { label: 'Accepted', value: 'accepted', variant: 'green' },
  { label: 'Pending', value: 'pending', variant: 'yellow' },
  { label: 'Decline', value: 'declined', variant: 'red' }
];

export const adminOffersFilterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    type: 'select', 
    options: [
      { value: '', label: 'All Statuses' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'pending', label: 'Pending' },
      { value: 'declined', label: 'Declined' },
    ],
  },

];