"use client"

import Form from "@/components/form/Form";
import { initialValues, siginFields } from "@/data/auth/signIn";
import { SignInForm } from "@/type/auth/signIn";

export default function SignInFormPage(){

  const validateProfile = (values: SignInForm) => {
    const errors: Partial<Record<keyof SignInForm, string>> = {};
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (!values.password) {
      errors.password = 'New password is required';
    } else if (values.password.length < 8) {
      errors.password = 'New password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
      errors.password = 'New password must contain uppercase, lowercase, and numbers';
    }

    
    return errors;
  };
  const handleEventSubmit = async (values: SignInForm) => {
    console.log("submitted values", values)
  }

  return(
    <>
      <Form
        fields={siginFields}
        initialValues={initialValues}
        validate={validateProfile}
        onSubmit={handleEventSubmit}
        submitLabel='Sign In'
      />
    </>
  )
}