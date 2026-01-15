import { StatusConfig, TableColumn } from '@/components/common/DataTable';
import { formatCurrency,formatNumberDate, formatUSD, toNumber } from '@/lib/formatter';
import { TransactionBase } from '@/type/pages/dashboard/transactions';
import { CalendarDaysIcon, LockClosedIcon, CreditCardIcon, ExclamationCircleIcon, CheckCircleIcon,} from '@heroicons/react/24/outline';

export const MOCK_MORTGAGE_STATS = [
  {
    id: 'balance',
    title: 'Escrow Balance',
    value: `${formatCurrency(41000000)}`,
    subText: 'AF123 down payment',
    icon: LockClosedIcon,
  },
  {
    id: 'progress',
    title: 'Next Payment Due',
    value: `${formatNumberDate('2025-12-25 14:46:52.681411+00')}`,
    subText: '$1,200 mortgage payment',
    icon: CalendarDaysIcon,
  },
  {
    id: 'next-payment',
    title: 'Payment Method',
    value: 'Direct Debit',
    subText: '**** **** 5679',
    icon: CreditCardIcon,
  },
];

export const columns: TableColumn<TransactionBase>[] = [
  { key: 'id', header: 'Transaction ID', sortable: false},
  { key: 'type', header: 'Description', sortable: false},
  { key: 'created_at', header: 'Date', sortable: false, accessor: (row) => formatNumberDate(row.created_at)},
  { key: 'amount', header: 'Amount', sortable: false, accessor: (row) => formatUSD({ amount: row.amount, fromCents: true, decimals: 2 })},
];

export const statusConfig: StatusConfig[] = [
  { value: 'succeeded', label: 'Active', variant: 'green' },
  { value: 'pending', label: 'Pending', variant: 'yellow' },
  { value: 'failed', label: 'Inactive', variant: 'red' },
  { value: 'cancelled', label: 'Verified', variant: 'blue' },
];

export const SellerTransactionscolumns: TableColumn<TransactionBase>[] = [
  { key: 'property', header: 'Property', sortable: false, accessor: (row) => row.properties?.title},
  { key: 'price', header: 'Property Amount', sortable: false, accessor: (row) => formatUSD({ amount: toNumber(row.properties?.price), fromCents: true, decimals: 2 })},
  { key: 'type', header: 'Description', sortable: false},
  { key: 'created_at', header: 'Date', sortable: false, accessor: (row) => formatNumberDate(row.created_at)},
  { key: 'amount', header: 'Deposited Amount', sortable: false, accessor: (row) => formatUSD({ amount: row.amount, fromCents: true, decimals: 2 })},
];

export const SellerTransactionstatusConfig: StatusConfig[] = [
  { value: 'succeeded', label: 'Credited', variant: 'green' },
  { value: 'pending', label: 'Pending', variant: 'yellow' },
  { value: 'release', label: 'Released', variant: 'blue' },
];

export const MOCK_SELLER_TRANSACTION_STATS = [
  { id: 'balance', title: 'Escrow Balance', value: `${formatCurrency(41000000)}`, icon: LockClosedIcon},
  { id: 'progress', title: 'Properties Ready for Payout', value: '3', icon: CheckCircleIcon},
  { id: 'next-payment', title: 'Pending Payout ', value: '2', icon: ExclamationCircleIcon},
];

export const adminTransactionscolumns: TableColumn<TransactionBase>[] = [
  { key: 'id', header: 'Transaction ID', sortable: false},
  { key: 'user', header: 'User', sortable: false, accessor: (row) => row.users?.name},
  { key: 'type', header: 'Description', sortable: false},
  { key: 'created_at', header: 'Date', sortable: false, accessor: (row) => formatNumberDate(row.created_at)},
  { key: 'amount', header: 'Deposited Amount', sortable: false, accessor: (row) => formatUSD({ amount: row.amount, fromCents: true, decimals: 2 })},
];