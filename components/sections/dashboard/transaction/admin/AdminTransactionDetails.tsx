import { TransactionBase } from "@/type/pages/dashboard/transactions";
import { getStatusBadge } from "../user/UserTransactionDetails";
import { formatDate, formatTime, formatUSD } from "@/lib/formatter";
import { DescriptionList } from "@/components/common/DescriptionList";
import { Button } from "@/components/primitives/Button";
import { useRouter } from "next/navigation";

interface Props {
  transaction: TransactionBase;
}

export default function AdminTransactionDetail({ transaction }: Props){
  const router = useRouter();

  return(
    <div className="space-y-9">
      <div>
        <h4 className=" text-base font-medium mb-2">Amount</h4>
        <div className="flex items-center justify-between border border-border p-5 rounded-xl">
          <span className="font-bold text-2xl" >{formatUSD({amount:transaction.amount,fromCents: true, decimals:2 })}</span>
          <span className={`${getStatusBadge(transaction.status)}`}>{transaction.status}</span>
        </div>
      </div>

      <div>
        <DescriptionList
          title="User Information"
          subtitle="Details and information about the User"
          items={[
            { label: 'User ID', value: { type: 'text', value: transaction.users?.id || ''}},
            { label: 'Name', value: { type: 'text', value: transaction.users?.name || ''}},
            { label: 'Email', value: { type: 'text', value: transaction.users?.email || ''}},
            { label: 'Role', value: { type: 'text', value: transaction.users?.role || ''}},
          ]}
        />
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