import { UserBase } from "@/type/user";
import { PropertyBase } from "../property";

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

