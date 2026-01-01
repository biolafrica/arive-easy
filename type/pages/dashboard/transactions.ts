export interface Metadata{
  session_url:string | null;
  expires_at:string;
}

export interface TransactionBase{
  id:string;
  user_id:string;
  application_id:string;
  stripe_session_id:string;
  type:string;
  stripe_payment_intent_id:string;
  amount:number;
  currency:string;
  status:string;
  payement_method:string;
  receipt_url:string;
  created_at:string;
  updated_at:string;
  metadata:Metadata
}