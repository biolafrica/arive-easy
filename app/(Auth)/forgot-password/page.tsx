import { Button } from '@/components/primitives/Button';
import { AuthCard } from '@/components/sections/auth/AuthLayout';
import ForgotPasswordFormPage from '@/components/sections/auth/ForgotPassword';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot Password"
      description="Enter your email address and we will send you a reset link."
    >
      <div className="space-y-4">
        <ForgotPasswordFormPage/>
        <Button variant="outline" fullWidth asChild>
          <Link href="/signin">Back to Login</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
