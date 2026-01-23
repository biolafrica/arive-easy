
'use client';

import { DescriptionList } from "@/components/common/DescriptionList";
import { Button } from "@/components/primitives/Button";
import { formatDate, formatTime, formatUSD } from "@/lib/formatter";
import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { useRouter } from "next/navigation";


interface Props {
  transaction: TransactionBase;
}

export const getStatusBadge = (status:string): string => {
  switch (status) {
    case 'succeeded':
      return 'badge badge-green'
    case 'pending':
      return 'badge badge-yellow'
    case 'failed':
      return 'badge badge-red'
    case 'cancelled':
      return 'badge blue'
    default:
      return 'badge';
  }
  
};

export default function UserTransactionDetails({ transaction }: Props) {  
  const router = useRouter();

  return (
    <div className="space-y-8">

      <div>
        <h4 className=" text-base font-medium mb-2">Amount</h4>
        <div className="flex items-center justify-between border border-border p-5 rounded-xl">
          <span className="font-bold text-2xl" >{formatUSD({amount:transaction.amount,fromCents: true, decimals:2 })}</span>
          <span className={`${getStatusBadge(transaction.status)}`}>{transaction.status}</span>
        </div>
      </div>

      <div>
        <DescriptionList
          title="Transaction Summary"
          subtitle="Details and information about this transaction"
          items={[
            { label: 'Transacion ID', value: { type: 'text', value: transaction.id}},
            { label: 'Date', value: { type: 'text', value: formatDate(transaction.created_at)}},
            { label: 'Time', value: { type: 'text', value: formatTime(transaction.created_at,)}},
            { label: 'type', value: { type: 'text', value: transaction.type}},
            { label: 'Payment Method', value: { type: 'text', value: transaction.payment_method }},
            { label: `${transaction.application_id? "Application ID" : "Property ID"}`, value: { type: 'text', value: transaction.application_id || transaction.property_id || '' }},
          ]}
        />
      </div>

      <Button onClick={()=>router.push(`${transaction.receipt_url}`)} fullWidth={true} >
        View Receipt
      </Button>

    </div>

  );
}