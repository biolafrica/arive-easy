'use client'

import Form from "@/components/form/Form";
import { initialValues, resetPasswordFields } from "@/data/auth/resetPassword";
import { ResetPassword } from "@/type/auth/resetPassword";

export default function ResetFormPage(){

  const validateProfile = (values: ResetPassword) => {
    const errors: Partial<Record<keyof ResetPassword, string>> = {};
    
    if (!values.password) {
      errors.password = 'New password is required';
    } else if (values.password.length < 8) {
      errors.password = 'New password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.password = 'New password must contain uppercase, lowercase, and numbers';
    }

    if (values.confirm_password !== values.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    return errors;
  };

  const handleEventSubmit = async (values: ResetPassword) => {
    console.log("submitted values", values)
  }

  return(
    <>
      <Form
        fields={resetPasswordFields}
        initialValues={initialValues}
        validate={validateProfile}
        onSubmit={handleEventSubmit}
        submitLabel='Update Password'
      />

    </>
  )
}