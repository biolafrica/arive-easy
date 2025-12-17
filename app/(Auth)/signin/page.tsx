import { Button } from '@/components/primitives/Button';
import { AuthCard } from '@/components/sections/auth/AuthLayout';
import SignInFormPage from '@/components/sections/auth/SignInForm';
import { AuthTabs } from '@/components/sections/auth/TabHeader';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <AuthCard title="Enter your credentials to access your account." >
      <AuthTabs active="signin" />

      <div className="space-y-4">
        <SignInFormPage/>
        <Button variant="outline" fullWidth leftIcon={<EnvelopeIcon className="h-4 w-4 text-blue-600" />}>
          Sign in with Google
        </Button>

        <div className="text-right">
          <Link href="/forgot-password" className="text-blue-600 text-sm">
            Forgot Password?
          </Link>
        </div>

      </div>
    </AuthCard>
  );
}
