'use client';

import { Button } from '@/components/primitives/Button';
import { AuthCard } from '@/components/sections/auth/AuthLayout';
import { createClient } from '@/utils/supabase/client';
import { InboxArrowDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CheckEmailPage() {
  
  const handleResend = async () => {
    const supabase = createClient();

    try {
      const email = localStorage.getItem('reset_email');

      if (!email) {
        toast.error('Please go back and enter your email again.');
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Email sent! Check your inbox.');
      }
    } catch (err) {
      toast.error('Failed to resend. Please try again.');
      console.error(err);
    }
  };

  return (
    <AuthCard
      title="Check your email"
      description="If an account exists, we’ve sent a reset link to your inbox."
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <InboxArrowDownIcon className="w-14 h-14 text-blue-600" />
        </div>

        <Button fullWidth onClick={handleResend}>
          Resend link
        </Button>

        <Button variant="outline" fullWidth asChild>
          <Link href="/signin">Back to Login</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
