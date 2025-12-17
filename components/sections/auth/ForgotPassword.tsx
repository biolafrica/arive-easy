'use client'

import Form from "@/components/form/Form";
import { forgotPasswordFields, initialValues } from "@/data/auth/forgotPassword";
import { ForgotPassword } from "@/type/auth/forgotPassword";

export default function ForgotPasswordFormPage(){
  const validateProfile = (values: ForgotPassword) => {
    const errors: Partial<Record<keyof ForgotPassword, string>> = {};
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    return errors;
  };

  const handleEventSubmit = async (values: ForgotPassword) => {
    console.log("submitted values", values)
  }

  return(
    <>
      <Form
        fields={forgotPasswordFields}
        initialValues={initialValues}
        validate={validateProfile}
        onSubmit={handleEventSubmit}
        submitLabel='Reset Password'
      />
    </>
  )
}
