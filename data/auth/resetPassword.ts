import { ResetPassword } from "@/type/auth/resetPassword";
import { FormField } from "@/type/form";

export const resetPasswordFields: FormField[] = [
  { name: 'password', label: 'Password ', type: 'password', placeholder: 'enter password', required: true},
  { name: 'confirm_password', label: 'Confirm Password', type: 'password', placeholder: 'Confirm password', required: true },
];

export const initialValues:ResetPassword ={
  password : "",
  confirm_password: ""
}