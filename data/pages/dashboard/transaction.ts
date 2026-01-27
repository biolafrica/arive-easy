import { StatusConfig, TableColumn } from '@/components/common/DataTable';
import { formatCurrency,formatNumberDate, formatUSD, toNumber } from '@/lib/formatter';
import { TransactionBase } from '@/type/pages/dashboard/transactions';
import * as icon from '@heroicons/react/24/outline';


export const MOCK_MORTGAGE_STATS = [
  {
    id: 'balance',
    title: 'Escrow Balance',
    value: `${formatCurrency(41000000)}`,
    subText: 'AF123 down payment',
    icon: icon.LockClosedIcon,
  },
  {
    id: 'progress',
    title: 'Next Payment Due',
    value: `${formatNumberDate('2025-12-25 14:46:52.681411+00')}`,
    subText: '$1,200 mortgage payment',
    icon: icon.CalendarDaysIcon,
  },
  {
    id: 'next-payment',
    title: 'Payment Method',
    value: 'Direct Debit',
    subText: '**** **** 5679',
    icon: icon.CreditCardIcon,
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
  { id: 'balance', title: 'Escrow Balance', value: `${formatCurrency(41000000)}`, icon: icon.LockClosedIcon},
  { id: 'progress', title: 'Properties Ready for Payout', value: '3', icon: icon.CheckCircleIcon},
  { id: 'next-payment', title: 'Pending Payout ', value: '2', icon: icon.ExclamationCircleIcon},
];

export const adminTransactionscolumns: TableColumn<TransactionBase>[] = [
  { key: 'id', header: 'Transaction ID', sortable: false},
  { key: 'user', header: 'User', sortable: false, accessor: (row) => row.users?.name},
  { key: 'type', header: 'Description', sortable: false},
  { key: 'created_at', header: 'Date', sortable: false, accessor: (row) => formatNumberDate(row.created_at)},
  { key: 'amount', header: 'Deposited Amount', sortable: false, accessor: (row) => formatUSD({ amount: row.amount, fromCents: true, decimals: 2 })},
];


export const PAYMENT_TYPES = {
  'processing_fee': {
    icon: icon.CreditCardIcon,
    title: 'Processing Fee Payment Successful!',
    description: 'Your application processing fee has been received',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    features: [
      'Application processing will begin immediately',
      'Identity verification can now proceed',
      'Payment confirmation sent to your email',
      'Track progress in your dashboard'
    ],
    emailMessage: 'Processing fee receipt has been sent to your email address.'
  },
  'legal_fee': {
    icon: icon.ScaleIcon,
    title: 'Legal Fee Payment Successful!',
    description: 'Your legal processing fee has been received',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      'Legal documentation processing will begin',
      'Contract preparation can now proceed',
      'Legal team has been notified',
      'Next steps will be communicated shortly'
    ],
    emailMessage: 'Legal fee receipt has been sent to your email address.'
  },
  'valuation_fee': {
    icon: icon.DocumentMagnifyingGlassIcon,
    title: 'Valuation Fee Payment Successful!',
    description: 'Your property valuation fee has been received',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      'Property valuation will be scheduled',
      'Professional assessor will be assigned',
      'Valuation report will be generated',
      'Results will be shared with all parties'
    ],
    emailMessage: 'Valuation fee receipt has been sent to your email address.'
  },
  'escrow': {
    icon: icon.ShieldCheckIcon,
    title: 'Escrow Payment Secured!',
    description: 'Your funds have been safely secured in escrow',
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    features: [
      'Funds are held securely until property transfer',
      'Seller cannot access funds until completion',
      'Full protection with transparent tracking',
      'Automatic release upon successful completion'
    ],
    emailMessage: 'Escrow confirmation has been sent to your email address.'
  }
} as const;

export type PaymentType = keyof typeof PAYMENT_TYPES;

export const CANCELLED_PAYMENT_TYPES = {
  'processing_fee': {
    icon: icon.CreditCardIcon,
    title: 'Processing Fee Payment Cancelled',
    description: 'Your application processing fee payment was not completed.',
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    retryText: 'Retry Processing Fee Payment',
    consequences: [
      'Application processing cannot continue',
      'Identity verification will remain locked',
      'No processing fees have been charged',
      'You can retry payment at any time'
    ]
  },
  'legal_fee': {
    icon: icon.ScaleIcon,
    title: 'Legal Fee Payment Cancelled',
    description: 'Your legal fee payment was not completed.',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    retryText: 'Retry Legal Fee Payment',
    consequences: [
      'Legal documentation cannot proceed',
      'Contract preparation will be delayed',
      'No legal fees have been charged',
      'Payment is required to continue'
    ]
  },
  'valuation_fee': {
    icon: icon.DocumentMagnifyingGlassIcon,
    title: 'Valuation Fee Payment Cancelled',
    description: 'Your property valuation fee payment was not completed.',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    retryText: 'Retry Valuation Fee Payment',
    consequences: [
      'Property valuation cannot be scheduled',
      'Assessment process will be delayed',
      'No valuation fees have been charged',
      'Payment is required for property assessment'
    ]
  },
  'escrow': {
    icon: icon.ShieldExclamationIcon,
    title: 'Escrow Payment Cancelled',
    description: 'Your escrow payment was not completed. The funds have not been secured.',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-50',
    retryText: 'Retry Escrow Payment',
    consequences: [
      'Property purchase cannot proceed',
      'Seller will not be notified',
      'No funds have been secured in escrow',
      'Application will remain on hold'
    ]
  }
} as const;

export type CancelledPaymentType = keyof typeof CANCELLED_PAYMENT_TYPES;
