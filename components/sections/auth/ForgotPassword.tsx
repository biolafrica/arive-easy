'use client'

import Form from "@/components/form/Form";
import { forgotPasswordFields, initialValues } from "@/data/auth/forgotPassword";
import { ForgotPassword } from "@/type/auth/forgotPassword";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ForgotPasswordFormPage(){
  const router = useRouter();

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

    console.log("submitted values", values)
    try {

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      });

      if (error) {
        console.log(error)
        toast.error(error.message);
        return;
      }

      localStorage.setItem("reset-email", values.email )
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
