import { UserBase } from "@/type/user";
import { PropertyBase } from "../property";
import { ApplicationBase } from "./application";

export interface Metadata{
  session_url:string | null;
  expires_at:string;
}

export interface TransactionBase{
  id:string;
  user_id:string;
  users?:UserBase
  application_id?:string;
  property_id?:string;
  applications?:ApplicationBase;
  properties?:PropertyBase;
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
  user_name:string;
  property_name?:string;
}

export type SellerTransactionBase = TransactionBase & {
  properties:PropertyBase
}

export type AdminTransactionBase = TransactionBase & {
  users:{
    id:string;
    name:string;
    email:string;
  };
}


