'use client';

import { useState } from 'react';
import { Button } from '@/components/primitives/Button';
import { toast } from 'sonner';
import { GoogleIcon } from '@/public/icons/google-icon';
import { signInWithGoogle } from '@/utils/auth/google-auth';
import * as Sentry from '@sentry/nextjs';


interface GoogleSignInButtonProps {
  variant?: 'signin' | 'signup';
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  fullWidth?: boolean;
  className?: string;
}

export function GoogleSignInButton({
  variant = 'signin',
  redirectTo,
  onSuccess,
  onError,
  fullWidth = true,
  className,
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithGoogle({redirectTo});

      if (result.success) {
        toast.loading(
          variant === 'signup' ? 'Creating your account with Google...' : 'Signing you in with Google...'
        );
        
        if (onSuccess) {
          onSuccess();
        }
        
      } else {
        throw result.error;
      }

    } catch (error) {
      console.error('Google sign-in error:', error);
      
      if (!onError) {
        Sentry.withScope((scope) => {
          scope.setTag('auth.provider', 'google');
          scope.setTag('auth.action', variant === 'signup' ? 'sign-up-button' : 'sign-in-button');
          scope.setLevel('error');
          Sentry.captureException(error);
        });

        toast.error(
          variant === 'signup' ? 'Failed to sign up with Google. Please try again.' : 'Failed to sign in with Google. Please try again.'
        );
      } else {
        onError(error);
      }
    } finally {
      setTimeout(() => setIsLoading(false), 5000);
    }
  };

  return (
    <Button
      variant="outline"
      fullWidth={fullWidth}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={className}
      leftIcon={
        isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        ) : (
          <GoogleIcon />
        )
      }
    >
      { isLoading ? 'Connecting...' : variant === 'signup' ? 'Sign up with Google' : 'Sign in with Google' }

    </Button>
  );
}

