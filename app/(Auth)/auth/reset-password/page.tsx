'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/primitives/Button';
import { getDashboardForRole } from '@/utils/common/dashBoardForRole';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

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
            const role = user.user_metadata?.role || user.app_metadata?.role || 'user';
            
            setStatus('success');
            
            const dashboardUrl = getDashboardForRole(role);
            router.replace(dashboardUrl);
            return;
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const role = session.user.user_metadata?.role || session.user.app_metadata?.role || 'user';
          setStatus('success');
          const dashboardUrl = getDashboardForRole(role);
          router.replace(dashboardUrl);
          return;
        }

        setStatus('error');
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    handleVerification();
  }, [router]);


  return (
    <main style={{ padding: 24, textAlign: 'center', paddingTop: 100 }}>
      
      {status === 'loading' && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="mt-4 text-xl">Verifying your email...</h2>
            <p className="text-gray-600">Please wait a moment</p>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="mt-4 text-xl">✓ Email verified!</h2>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
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
