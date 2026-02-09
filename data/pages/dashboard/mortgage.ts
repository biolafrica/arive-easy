import { formatDate, formatUSD } from "@/lib/formatter"
import { BanknotesIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline"

export const statData =(money:number, next:string, last:string )=>{
  return [
    {
      id: 'loan_balance',
      title: 'Loan Balance',
      value: `${formatUSD({amount: money})}`,
      icon: BanknotesIcon,
    },
    {
      id: 'next_payment',
      title: 'Next Payment',
      value: `${formatDate(next)}`,
      icon: CalendarIcon,
    },
    {
      id: 'end_date',
      title: 'End Date',
      value: `${formatDate(last)}`,
      icon: ClockIcon,
    },
  ]
}