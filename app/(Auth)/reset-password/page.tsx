import { Button } from '@/components/primitives/Button';
import { AuthCard } from '@/components/sections/auth/AuthLayout';
import ResetFormPage from '@/components/sections/auth/ResetForm';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set a new password"
      description="Ensure it differs from previous ones for security."
    >
      <div className="space-y-4">
        <ResetFormPage/>
        <Button variant="outline" fullWidth asChild>
          <Link href="/signin">Back to Login</Link>
        </Button>
      </div>

    </AuthCard>
  );
}
