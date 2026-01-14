export interface Metadata{
  session_url:string | null;
  expires_at:string;
}

export interface TransactionBase{
  id:string;
  user_id:string;
  application_id?:string;
  stripe_session_id:string;
  type:string;
  stripe_payment_intent_id:string;
  amount:number;
  currency:string;
  status:string;
  payment_method:string;
  receipt_url:string;
  created_at:string;
  updated_at:string;
  metadata?:Metadata
}

export type SellerTransactionBase = Omit<TransactionBase, 'application_id' >& {
  property_id:string;
  properties:{
    title:string;
    price:string;

  }
}

export type AdminTransactionBase = TransactionBase & {
  users:{
    id:string;
    name:string;
    email:string;
  };
}


