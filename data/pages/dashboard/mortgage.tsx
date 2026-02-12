import { formatDate, formatUSD } from "@/lib/formatter"
import { TabType } from "@/type/pages/dashboard/mortgage";
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