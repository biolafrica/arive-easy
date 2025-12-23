export interface UserBase {
  id: string;
  email: string;
  name: string;
  phone_number: string;
  role: string;
  created_at: string;
  updated_at: string;
  home_country: string;
  residence_country: string;
}

export type UserBackendFormProps = Pick<UserBase, 'email' | 'id' | 'name' | "role"> &{
  password: string;
  email_verified : boolean;
}