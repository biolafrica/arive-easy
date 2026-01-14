import { StatusConfig, TableColumn } from '@/components/common/DataTable';
import { formatCurrency,formatNumberDate, formatUSD, toNumber } from '@/lib/formatter';
import { AdminTransactionBase, SellerTransactionBase, TransactionBase } from '@/type/pages/dashboard/transactions';
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

export const SellerTransactionscolumns: TableColumn<SellerTransactionBase>[] = [
  { key: 'property', header: 'Property', sortable: false, accessor: (row) => row.properties.title},
  { key: 'price', header: 'Property Amount', sortable: false, accessor: (row) => formatUSD({ amount: toNumber(row.properties.price), fromCents: true, decimals: 2 })},
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

export const MOCK_DATA:SellerTransactionBase[] = [
  {
    id: '1',
    property_id: '101',
    properties: {
      title: 'Modern Apartment in City Center',
      price: '350000'
    },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T12:00:00Z',
    receipt_url: 'https://example.com/receipt/1',
    type: 'escrow',
    amount: 35000,
    currency: 'USD',
    payment_method: 'credit_card',
    status: 'succeeded',
    user_id: '201',
    stripe_session_id: 'sess_123',
    stripe_payment_intent_id: 'pi_123',
    
  },
  {
    id: '2',
    property_id: '102',
    properties: {
      title: 'Cozy Cottage by the Lake',
      price: '275000'
    },
    created_at: '2024-02-20T14:45:00Z',
    updated_at: '2024-02-21T09:15:00Z',
    receipt_url: 'https://example.com/receipt/2',
    type: 'escrow',
    amount: 27500,
    currency: 'USD',
    payment_method: 'bank_transfer',
    status: 'pending',
    user_id: '202',
    stripe_session_id: 'sess_456',
    stripe_payment_intent_id: 'pi_456',
  }
]

export function useSellerTransactions(queryParams?: Record<string, any>) {
  return {
    transactions:MOCK_DATA,
    isLoading: false,
  }
}

export const adminTransactionscolumns: TableColumn<AdminTransactionBase>[] = [
  { key: 'id', header: 'Transaction ID', sortable: false},
  { key: 'user', header: 'User', sortable: false, accessor: (row) => row.users.name},
  { key: 'type', header: 'Description', sortable: false},
  { key: 'created_at', header: 'Date', sortable: false, accessor: (row) => formatNumberDate(row.created_at)},
  { key: 'amount', header: 'Deposited Amount', sortable: false, accessor: (row) => formatUSD({ amount: row.amount, fromCents: true, decimals: 2 })},
];

export const MOCK_DATA_ADMIN:AdminTransactionBase[] = [
  {
    id: 'TR-101',
    users: {
      id: '201',
      name: 'John Doe',
      email:"jogn@kletch.com"
    },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T12:00:00Z',
    receipt_url: 'https://example.com/receipt/1',
    type: 'escrow',
    amount: 35000,
    currency: 'USD',
    payment_method: 'credit_card',
    status: 'succeeded',
    user_id: '201',
    stripe_session_id: 'sess_123',
    stripe_payment_intent_id: 'pi_123',
    application_id: 'app_123',
    
  },
  {
    id: 'TR-102',
    users: {
      id: '202',
      name: 'Jane Smith',
      email: 'jane@gmail.com',
    },
    created_at: '2024-02-20T14:45:00Z',
    updated_at: '2024-02-21T09:15:00Z',
    receipt_url: 'https://example.com/receipt/2',
    type: 'processing fee',
    amount: 27500,
    currency: 'USD',
    payment_method: 'bank_transfer',
    status: 'pending',
    user_id: '202',
    stripe_session_id: 'sess_456',
    stripe_payment_intent_id: 'pi_456',
    application_id: 'app_456',

  }
 
];

export function useAdminTransactions(queryParams?: Record<string, any>) {
  return {
    transactions:MOCK_DATA_ADMIN,
    isLoading: false,
  }
};