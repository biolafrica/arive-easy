import { AuthCard } from '@/components/sections/auth/AuthLayout';
import { GoogleSignInButton } from '@/components/sections/auth/GoogleSignInButton';
import SignInFormPage from '@/components/sections/auth/SignInForm';
import { AuthTabs, Divider } from '@/components/sections/auth/TabHeader';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <AuthCard title="Enter your credentials to access your account." >
      <AuthTabs active="signin" />

      <div className="space-y-4">

        <SignInFormPage/>

        <Divider />

        <GoogleSignInButton
          variant="signin"
          redirectTo="/"
        />

        <div className="text-right">
          <Link href="/forgot-password" className="text-blue-600 text-sm">
            Forgot Password?
          </Link>
        </div>

      </div>
    </AuthCard>
  );
}
