import { TransactionBase } from "@/type/pages/dashboard/transactions";

interface Props {
  transaction: TransactionBase;
}

export default function AdminTransactionDetail({ transaction }: Props){
  return(
    <div>
      <h1>Seller Transaction Detail</h1>
    </div>
  );
}