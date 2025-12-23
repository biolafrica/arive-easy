"use client"

import Form from "@/components/form/Form";
import { initialValues, sigupFields } from "@/data/auth/signUp";
import { useUserRegistration } from "@/hooks/useSpecialized";
import { SignUpForm } from "@/type/auth/signUp";
import { useRouter } from "next/navigation";



export default function SignUpFormPage(){
  const router = useRouter();
  const create = useUserRegistration()

  const validateProfile = (values: SignUpForm) => {
    const errors: Partial<Record<keyof SignUpForm, string>> = {};
    
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

    if (values.confirm_password !== values.password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleEventSubmit = async (values: SignUpForm) => {
    const formData = {
      name : values.name,
      email: values.email,
      password: values.password,
      role: values.role
    }
    
    await create(formData)
  }

  return(
    <>
      <Form
        fields={sigupFields}
        initialValues={initialValues}
        validate={validateProfile}
        onSubmit={handleEventSubmit}
        submitLabel='Create Account'
      />
    </>
  )
}