import { AuthCard } from '@/components/sections/auth/AuthLayout';
import { GoogleSignInButton } from '@/components/sections/auth/GoogleSignInButton';
import SignUpFormPage from '@/components/sections/auth/SignUpForm';
import { AuthTabs, Divider } from '@/components/sections/auth/TabHeader';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <AuthCard title="Create a new account to get started." >

      <AuthTabs active="signup" />

      <div className="space-y-4">

        <SignUpFormPage/>

        <Divider />

        <GoogleSignInButton
          variant="signup"
          redirectTo="/onboarding"
        />

      </div>

      <h4 className='text-sm mt-2 text-secondary'>
        By clicking "Create Account" or "Sign up with Google", you agree to the{' '}
        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{' '} and{' '}
        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy </Link>.
      </h4>

    </AuthCard>
  );
}
