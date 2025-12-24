export interface UserBase {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  role: string;
  avatar: string
  created_at: string;
  updated_at: string;
  home_country: string;
  residence_country: string;
  address:string;
  bio:string;
}

export type UserBackendFormProps = Pick<UserBase, 'email' | 'id' | 'name' | "role"> &{
  password: string;
  email_verified : boolean;
}

export type UserProfileUserForm = Pick<UserBase, 'avatar' | 'name' | 'email' | 'residence_country' | 'phone_number'>
export type SellerProfileUserForm = Pick<UserBase, 'avatar' | 'name' | 'email' | 'phone_number'  | 'address' | 'bio'>
