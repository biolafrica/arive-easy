'use client'

import Form from "@/components/form/Form";
import { passwordFields } from "@/data/pages/dashboard/users";
import { useAuthContext } from "@/providers/auth-provider";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface ChangePasswordFormData {
  password: string;
  new_password: string;
  confirm_password: string;
}

export default function ResetPasswordForm (){
  const { user } = useAuthContext();

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

  const handleChangePasswordSubmit = async (
    values: ChangePasswordFormData
  ): Promise<void> => {
    const supabase = createClient();

    try {
      if (!user || !user.email) {
        toast.error("User not authenticated.");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: values.password,
      });

      if (signInError) {
        console.error("Error verifying current password:", signInError);
        toast.error("Current password is incorrect");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: values.new_password,
      });

      if (updateError) {
        console.error("Error updating password:", updateError);
        toast.error(
          updateError instanceof Error
            ? updateError.message
            : "Error updating, please try again."
        );
        return;
      }

      toast.success("Password changed successfully.");
    } catch (error) {
      console.error("Unexpected error changing password:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Unexpected error changing password."
      );
    }
  };


  return(
    <div>
      <Form
        fields={passwordFields}
        initialValues={initialValues}
        validate={validateChangePassword}
        onSubmit={handleChangePasswordSubmit}
        submitLabel= "Change Password"
      />
    </div>
  )

}