'use client'

import Form from "@/components/form/Form";
import { passwordFields } from "@/data/pages/dashboard/users";

interface ChangePasswordFormData {
  password: string;
  new_password: string;
  confirm_password: string;
}

export default function ResetPasswordForm (){

  const initialValues ={
    password: '',
    new_password: '',
    confirm_password: '',
  }

  
  const validateChangePassword = (values: ChangePasswordFormData) => {
    const errors: Partial<Record<keyof ChangePasswordFormData, string>> = {};
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and numbers';
    }

    if (!values.new_password) {
      errors.new_password = 'New password is required';
    } else if (values.new_password.length < 8) {
      errors.new_password = 'New password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.new_password)) {
      errors.new_password = 'New password must contain uppercase, lowercase, and numbers';
    }

    if (values.new_password !== values.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmitPassword = (values: ChangePasswordFormData)=>{
    console.log(values)
  }

  return(
    <div>
      <Form
        fields={passwordFields}
        initialValues={initialValues}
        validate={validateChangePassword}
        onSubmit={handleSubmitPassword}
        submitLabel= "Change Password"
      />
    </div>
  )

}