import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  
  if (error) {
    console.error('OAuth error:', error, error_description);
    return NextResponse.redirect(
      `${requestUrl.origin}/signin?error=${encodeURIComponent(
        error_description || error || 'Authentication failed'
      )}`
    );
  }

  if (!code) {
    console.error('No code provided in callback');
    return NextResponse.redirect(
      `${requestUrl.origin}/signin?error=${encodeURIComponent('No authorization code provided')}`
    );
  }

  try {
    const supabase = await createClient();
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error('Code exchange error:', exchangeError);
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=${encodeURIComponent(
          exchangeError.message || 'Failed to complete authentication'
        )}`
      );
    }

    if (!data?.user || !data?.session) {
      console.error('No user or session in exchange response');
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=${encodeURIComponent('Authentication failed')}`
      );
    }

    const { data: existingUser, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();


    if (!existingUser) {
      console.log('Creating new user in database');
      
      const newUserData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
        avatar: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture || '',
        role: null,
        provider: 'google',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
      .from('users')
      .insert(newUserData);
      
      if (insertError) {
        console.error('Failed to create user:', insertError);
      } else {
        console.log('User created successfully');
      }

      return NextResponse.redirect(`${requestUrl.origin}/onboarding?welcome=true`);
    }

    if (!existingUser.role) {
      console.log('Existing user without role, redirecting to onboarding');
      return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
    }
    
    if (next && next !== '/' && !next.includes('onboarding')) {
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }

    const dashboardRoute = existingUser.role === 'seller' ? '/seller-dashboard' : '/user-dashboard';
    
    return NextResponse.redirect(`${requestUrl.origin}${dashboardRoute}`);

  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(
      `${requestUrl.origin}/signin?error=${encodeURIComponent(
        error instanceof Error ? error.message : 'Authentication failed'
      )}`
    );
  }
}