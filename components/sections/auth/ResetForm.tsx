'use client'

import Form from "@/components/form/Form";
import { Button } from "@/components/primitives/Button";
import { initialValues, resetPasswordFields } from "@/data/auth/resetPassword";
import { ResetPassword } from "@/type/auth/resetPassword";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetFormPage(){
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsValidToken(true);
      } else {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (!error) {
            setIsValidToken(true);
            window.history.replaceState(null, '', window.location.pathname);
          } else {
            toast.error('Invalid or expired reset link. Please request a new one.');
          }
        } else {
          toast.error('Invalid or expired reset link. Please request a new one.');
        }
      }
    };

    checkSession();
  }, [supabase]);

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

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) {
        setError(error.message)
        toast.error(error.message);
        return;
      }

      localStorage.removeItem('reset_email');
      
      toast.success("Password updated successfully")
      router.push('/signin');
      
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message || 'An error occurred. Please try again.');
    }
  };

  if (!isValidToken && error) {
    return (
      <div className="space-y-4 mx-auto">
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm text-center">
          {error}
        </div>
        <Button variant="outline" fullWidth onClick={() => router.push('/auth/forgot-password')}>
          Request New Reset Link
        </Button>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="text-center py-4 mx-auto">
        <p className="text-gray-600">Verifying reset link...</p>
      </div>
    );
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