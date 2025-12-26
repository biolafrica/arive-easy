import { formatCurrency,formatNumberDate } from '@/lib/formatter';
import { CalendarDaysIcon, LockClosedIcon, CreditCardIcon, HomeModernIcon, FolderIcon,
} from '@heroicons/react/24/outline';

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

export const MOCK_BUYER_DASHBOARD_STATS = [
  {
    id: 'application',
    title: 'All Application',
    value: '5',
    icon: FolderIcon,
  },
  {
    id: 'property',
    title: 'Property Owned',
    value: '2',
    icon: HomeModernIcon,
  },
  {
    id: 'balance',
    title: 'Escrow Balance',
    value: `${formatCurrency(41000000)}`,
    icon: LockClosedIcon,
  },
];
