import { DescriptionList } from "@/components/common/DescriptionList";
import { Button } from "@/components/primitives/Button";
import { formatDate, formatUSD, toNumber } from "@/lib/formatter";
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
    case 'released':
      return 'badge badge-red'
    default:
      return 'badge';
  }
  
};

export default function SellerTransactionDetail({ transaction }: Props){
  const router = useRouter();

  return(
    <div className="space-y-8" >

      <div>
        <h4 className=" text-base font-medium mb-2">Deposit Amount</h4>
        <div className="flex items-center justify-between border border-border p-5 rounded-xl">
          <span className="font-bold text-2xl">{formatUSD({amount:transaction.amount,fromCents: true, decimals:2 })}</span>
          <span className={`${getStatusBadge(transaction.status)}`}>{transaction.status}</span>
        </div>
      </div>

      <div className="space-y-8 ">
        <DescriptionList
          title="Property Details"
          subtitle="Details and information about this property"
          items={[
            { label: 'Property ID', value: { type: 'text', value: transaction?.property_id || ''}},
            { label: 'Property Name', value: { type: 'text', value: transaction.properties?.title || ''}},
            { label: 'Property Price', value: { type: 'text', value: formatUSD({ amount: toNumber(transaction.properties?.price || 0), fromCents: false, decimals: 2 })}},
          ]}
        />

        <DescriptionList
          title="Transaction Summary"
          subtitle="Details and information about this transaction"
          items={[
            { label: 'Transacion ID', value: { type: 'text', value: transaction.id}},
            { label: 'Date', value: { type: 'text', value: formatDate(transaction.created_at)}},
            { label: 'Time', value: { type: 'text', value: formatDate(transaction.created_at,)}},
            { label: 'type', value: { type: 'text', value: transaction.type}},
            { label: 'Payment Method', value: { type: 'text', value: transaction.payment_method }},
          ]}
        />

    
      </div>

      <Button onClick={()=>router.push(`${transaction.receipt_url}`)} fullWidth={true} >
        View Receipt
      </Button>

    </div>
  )
}