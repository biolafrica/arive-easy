export interface UserBase {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  role: string;
  avatar?: string | File | null;
  created_at: string;
  updated_at: string;
  home_country?: string;
  residence_country: string;
  address?:string;
  bio?:string;
  provider?: string;
}


export type UserAvatarForm =Pick<UserBase, 'avatar' | 'name' | 'email' | 'residence_country' | 'phone_number'> & {
  avatarFile?: File ;
}

export type UserBackendFormProps = Pick<UserBase, 'email' | 'id' | 'name' | "role"> &{
  password: string;
  email_verified : boolean;
}

export type UserProfileUserForm = Pick<UserBase, 'avatar' | 'name' | 'email' | 'residence_country' | 'phone_number'>


export type SellerProfileUserForm = Pick<UserBase, 'avatar' | 'name' | 'email' | 'phone_number'  | 'address' | 'bio'>
