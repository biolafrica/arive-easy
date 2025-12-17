import { SignInForm } from "@/type/auth/signIn";
import { FormField } from "@/type/form";


export const siginFields: FormField[] = [
  { name: 'email', label: 'Email ', type: 'email', placeholder: 'enter email', required: true},
  { name: 'password', label: 'Password', type: 'password', placeholder: 'enter password', required: true },
];

export const initialValues:SignInForm ={
  email : "",
  password : ""
}


