import { SignUpForm } from "@/type/auth/signUp";
import { FormField } from "@/type/form";

export const sigupFields: FormField[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'enter your first name', required: true},
  { name: 'email', label: 'Email ', type: 'email', placeholder: 'enter email', required: true},
  { name: 'password', label: 'Password', type: 'password', placeholder: 'enter password', required: true },
  { name: 'confirm_password', label: 'Confirm Password', type: 'password', placeholder: 'confirm password', required: true },
  { name: 'role', label: 'Role', type: 'select',required: true,
    options: [
      { label: 'Select role', value: '' },
      { label: 'Homebuyer', value: 'homebuyer' },
      { label: 'Seller', value: 'seller' },
    ],
  },
];

export const initialValues:SignUpForm ={
  name: "",
  email : "",
  password : "",
  confirm_password: "",
  role : ""
}
