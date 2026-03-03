'use client'

import Form from "@/components/form/Form";
import { forgotPasswordFields, initialValues } from "@/data/auth/forgotPassword";
import { ForgotPassword } from "@/type/auth/forgotPassword";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ForgotPasswordFormPage(){
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'invalid_link') {
      toast.error('Your reset link has expired or is invalid. Please request a new one.');
    }
  }, [searchParams]);

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
    const supabase = createClient()
    try {

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/confirm?next=/auth/reset-password`,

      });

      if (error) {
        console.log(error)
        toast.error(error.message);
        return;
      }

      localStorage.setItem("reset_email", values.email )
      router.push('/check-email');

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred. Please try again");
      console.error("Error submitting email:", error);

    }
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
