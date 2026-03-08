import { FilterConfig } from "@/components/table/FilterDropdown";
import { TableColumn } from "@/components/table/SummaryTable";
import { StatusConfig } from "@/components/table/TableCore";
import { formatDate, formatUSD } from "@/lib/formatter"
import { MortgagePayment, TabType } from "@/type/pages/dashboard/mortgage";
import * as icon from "@heroicons/react/24/outline"

export const statData =(money:number, next:string, last:string )=>{
  return [
    {
      id: 'loan_balance',
      title: 'Loan Balance',
      value: `${formatUSD({amount: money})}`,
      icon: icon.CurrencyDollarIcon,
    },
    {
      id: 'next_payment',
      title: 'Next Payment',
      value: `${formatDate(next)}`,
      icon: icon.CalendarIcon,
    },
    {
      id: 'end_date',
      title: 'End Date',
      value: `${formatDate(last)}`,
      icon: icon.ClockIcon,
    },
  ]
}

export const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: icon.Squares2X2Icon },
  { id: 'payments', label: 'Payments', icon: icon.CreditCardIcon },
  { id: 'documents', label: 'Documents', icon: icon.DocumentTextIcon },
];

export const columns:TableColumn<MortgagePayment>[] = [
  { key: 'due_date', header: 'Due Date', accessor: (row) => formatDate(row.due_date)},
  { key: 'amount', header: 'Amount', accessor: (row) => formatUSD({ amount: row.amount, decimals: 2,})},
  { key: 'paid_at', header: 'Paid On', accessor: (row) => row.paid_at ? formatDate(row.paid_at) : 'Not Paid'},
]

export const statusConfig: StatusConfig[] = [
  { value: 'succeeded', label: 'Credited', variant: 'green' },
  { value: 'pending', label: 'Pending', variant: 'yellow' },
  { value: 'scheduled', label: 'Scheduled', variant: 'blue' },
  { value: 'processing', label: 'Processing', variant: 'blue' },
  { value: 'failed', label: 'Failed', variant: 'red' },
  { value: 'cancelled', label: 'Cancelled', variant: 'red' },
];

export const filterConfigs: FilterConfig[] = [
  {
    key: 'status',
    label: 'Status',
    placeholder: 'All Statuses',
    type: 'select', 
    options: [
      { value: '', label: 'All Statuses'},
      { value: 'succeeded', label: 'Credited'},
      { value: 'pending', label: 'Pending'},
      { value: 'scheduled', label: 'Released'},
      { value: 'processing', label: 'Released'},
      { value: 'failed', label: 'Released'},
      { value: 'cancelled', label: 'Released'},
    ],
  },
];