import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export interface GoogleAuthOptions {
  redirectTo?: string;
  scopes?: string;
  queryParams?: Record<string, string>;
}

export async function signInWithGoogle(options?: GoogleAuthOptions) {
  const supabase = createClient();
  
  try {
    const origin = window.location.origin;

    const finalDestination = options?.redirectTo || '/';
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/api/auth-callback?next=${encodeURIComponent(finalDestination)}`,
        scopes: 'email profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
          ...options?.queryParams,
        },
      },
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Google sign-in error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to sign in with Google');
    return { success: false, error };
  }
}

export async function getGoogleUserProfile() {
  const supabase = createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (!user) {
      throw new Error('No user found');
    }

    const googleProfile = {
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      emailVerified: user.user_metadata?.email_verified,
      provider: 'google',
    };

    return googleProfile;
    
  } catch (error) {
    console.error('Error getting Google profile:', error);
    return null;
  }
}

export async function linkGoogleAccount() {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to link a Google account');
    }

    const { data, error } = await supabase.auth.linkIdentity({
      provider: 'google',
    });

    if (error) throw error;

    toast.success('Google account linked successfully');
    return { success: true, data };
    
  } catch (error) {
    console.error('Error linking Google account:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to link Google account');
    return { success: false, error };
  }
}

export async function unlinkGoogleAccount() {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to unlink a Google account');
    }

    const googleIdentity = user.identities?.find(
      (identity) => identity.provider === 'google'
    );

    if (!googleIdentity) throw new Error('No Google account linked');

    const { data, error } = await supabase.auth.unlinkIdentity(googleIdentity);

    if (error) throw error;

    toast.success('Google account unlinked successfully');
    return { success: true, data };
    
  } catch (error) {
    console.error('Error unlinking Google account:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to unlink Google account');
    return { success: false, error };
  }
}