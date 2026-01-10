import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' },{ status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' },{ status: 401 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,{ user_metadata: {role: role}}
    );

    if (error) {
      console.error('Error updating user metadata:', error);
      return NextResponse.json({ error: error.message },{ status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User metadata updated successfully', data });

  } catch (error) {
    console.error('Unexpected error updating user metadata:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' },{ status: 500 });
  }
}