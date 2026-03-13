"use client"

import Form from "@/components/form/Form";
import { initialValues, siginFields } from "@/data/auth/signIn";
import { SignInForm } from "@/type/auth/signIn";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Sentry from "@sentry/nextjs";
import { getDashboardForRole } from "@/utils/common/dashBoardForRole";


export default function SignInFormPage(){
  const router = useRouter();

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
    const supabase = createClient();

    try {
      const {error, data} = await supabase.auth.signInWithPassword({
        email:values.email, 
        password:values.password
      });

      if (data.user) {
        Sentry.setUser({
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
        });
      }

      if (error) {
        throw error;
      }
      
      const role = data.user.user_metadata?.role || 'public';
      const dashboardUrl = getDashboardForRole(role)
      
      toast.success("Logged In Successfully");
      router.push(dashboardUrl)
      
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('component', 'sign-in');
        scope.setContext('auth', { email: values.email });
        Sentry.captureException(error);
      });

      toast.error(error instanceof Error ? error.message : "Error logging in, please try again.");
      console.error("Error submitting login form:", error);
    }   

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