import { UserBase } from "@/type/user";
import { PropertyBase } from "../property";
import { ApplicationBase } from "./application";

export interface OfferBase{
  id:string;
  users?:UserBase;
  user_id: string;

  application_id:string;
  applications?:ApplicationBase;

  property_id:string;
  properties?:PropertyBase

  amount:string;
  status:string;
  created_at:string;
  updated_at?:string;
  type:string;

  rejection_note?:string;
  property_name:string;
}

export interface OffersBase{
  users:MockUser;
  id:string;
  listing_id:string;
  buyer_id:string;
  listings:MockListing;
  created_at:string;
  updated_at:string;
  status:string;
}

export interface MockUser{
  name:string;
  email:string;
  phone_number:string;
}

export interface MockListing{
  title:string;
  price:string;
}

