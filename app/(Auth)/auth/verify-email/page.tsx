'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/primitives/Button';
import { getDashboardForRole } from '@/utils/common/dashBoardForRole';
import { useWelcomeEmail } from '@/hooks/useSpecialized/useUser';
import * as Sentry from "@sentry/nextjs";
import Loading from '@/components/feedbacks/Loading';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';


export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [verifyError, setVerifyError] = useState<unknown>(null);
  const { sendWelcomeEmail } = useWelcomeEmail();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const supabase = createClient();

        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            setVerifyError(error); 
            setStatus('error');
            return;
          }

          if (data.session) {
            window.history.replaceState(
              null,
              '',
              window.location.pathname
            );

            const user = data.session.user;
            const role = user.app_metadata?.role || user.user_metadata?.role || 'public';

            Sentry.setUser({
              id: user.id,
              email: user.email,
              username: user.user_metadata?.name || user.email?.split('@')[0],
            });

            sendWelcomeEmail({
              userId: user.id,
              email: user.email!,
              userName: user.user_metadata?.name || 'customer',
              role: role as 'user' | 'seller' | 'admin' | 'agent',
            });
            
            setStatus('success');
            
            setTimeout(()=>{
              const dashboardUrl = getDashboardForRole(role);
              router.replace(dashboardUrl);
            }, 1500)
           
            return;
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const user = session.user;
          const role = session.user.app_metadata?.role || 'public';
          Sentry.setUser({
            id: user.id,
            email: user.email,
            username: user.user_metadata?.name,
          });

          setStatus('success');
          const dashboardUrl = getDashboardForRole(role);
          router.replace(dashboardUrl);
          return;
        }

        setStatus('error');
      } catch (error) {
        setVerifyError(error);  
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    handleVerification();
  }, [router]);

  useEffect(() => {
    if (verifyError) {
      Sentry.withScope((scope) => {
        scope.setTag('component', 'verify-email');
        scope.setLevel('error');
        Sentry.captureException(verifyError);
      });
    }
  }, [verifyError]);


  return (
    <main style={{ padding: 24, textAlign: 'center', paddingTop: 100 }}>

      {status === 'loading' && (
        <Loading heading='Verifying your email' subheading="Please wait a moment" />
      )}

      {status === 'success' && (
        <Loading heading='Email verified!' subheading="Redirecting to your dashboard..." />
      )}

      {status === 'error' && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <ExclamationTriangleIcon className='text-red-500 text-6xl mb-4 h-7 w-7'/>
            <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">Your email may already be verified. Please try signing in.</p>
            <Button
              onClick={() => router.push('/signin')}
              className="md"
            >
              Go to Login
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
