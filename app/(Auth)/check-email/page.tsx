import { Button } from '@/components/primitives/Button';
import { AuthCard } from '@/components/sections/auth/AuthLayout';
import { InboxArrowDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CheckEmailPage() {
  return (
    <AuthCard
      title="Check your email"
      description="If an account exists, we’ve sent a reset link to your inbox."
    >
      <div className="space-y-4">
        <div className='flex justify-center'>
          <InboxArrowDownIcon className='w-14 h-14 text-blue-600'/>
        </div>
        <Button fullWidth>Resend link</Button>
        <Button variant="outline" fullWidth asChild>
          <Link href="/signin">Back to Login</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
