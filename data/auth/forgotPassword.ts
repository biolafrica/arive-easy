import { ForgotPassword } from "@/type/auth/forgotPassword";
import { FormField } from "@/type/form";

export const forgotPasswordFields: FormField[] = [
  { name: 'email', label: 'Email ', type: 'email', placeholder: 'enter email', required: true},
];

export const initialValues:ForgotPassword ={
  email: ""
}