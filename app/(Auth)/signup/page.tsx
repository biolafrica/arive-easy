import { Button } from '@/components/primitives/Button';
import { AuthCard } from '@/components/sections/auth/AuthLayout';
import SignUpFormPage from '@/components/sections/auth/SignUpForm';
import { AuthTabs } from '@/components/sections/auth/TabHeader';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <AuthCard title="Create a new account to get started." >

      <AuthTabs active="signup" />

      <div className="space-y-4">
        <SignUpFormPage/>
        <Button variant="outline" fullWidth  leftIcon={<EnvelopeIcon className="h-4 w-4 text-blue-600" />}>
          Sign up with Google
        </Button>
      </div>
      <h4 className='text-sm mt-2 text-secondary'>
        By clicking “Create Account”, you agree to the  and Privacy Policy
        <Link href="/terms" className="text-blue-600 text-sm"> Terms and Services</Link> and
        <Link href="/privacy" className="text-blue-600 text-sm"> Privacy Policy</Link>.
      </h4>
    </AuthCard>
  );
}
