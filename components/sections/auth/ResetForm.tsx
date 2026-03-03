'use client'

import Form from "@/components/form/Form";
import { Button } from "@/components/primitives/Button";
import { initialValues, resetPasswordFields } from "@/data/auth/resetPassword";
import { ResetPassword } from "@/type/auth/resetPassword";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetFormPage() {
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser(); // use getUser, not getSession
      setIsValidSession(!!user);
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
    if (values.confirm_password !== values.password) {
      errors.confirm_password = 'Passwords do not match';
    }
    return errors;
  };

  const handleEventSubmit = async (values: ResetPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: values.password });

      if (error) {
        toast.error(error.message);
        return;
      }

      localStorage.removeItem('reset_email');
      await supabase.auth.signOut();
      toast.success("Password updated successfully");
      router.push('/signin');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (isValidSession === null) {
    return <p className="text-center py-4 text-gray-600">Verifying reset link...</p>;
  }

  if (!isValidSession) {
    return (
      <div className="space-y-4 mx-auto">
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm text-center">
          Invalid or expired reset link.
        </div>
        <Button variant="outline" fullWidth onClick={() => router.push('/auth/forgot-password')}>
          Request New Reset Link
        </Button>
      </div>
    );
  }

  return (
    <Form
      fields={resetPasswordFields}
      initialValues={initialValues}
      validate={validateProfile}
      onSubmit={handleEventSubmit}
      submitLabel='Update Password'
    />
  );
}