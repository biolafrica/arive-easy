
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { requireAuth } from '@/utils/server/authMiddleware';
import { sellerWelcomeEmail, userWelcomeEmail } from '@/utils/email/templates/welcome';
import { sendEmail } from '@/utils/email/send_email';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: { message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { email, userName, role } = body;

    if (!email || !userName || !role) {
      return NextResponse.json( { error: { message: 'Missing required fields' } },{ status: 400 });
    }

    let emailHtml: string;
    let subject: string;

    if (role === 'seller' || role === 'agent') {
      subject = 'Welcome to Kletch - Start Listing Properties';
      emailHtml = sellerWelcomeEmail({ sellerName: userName });
    } else {
      subject = 'Welcome to Kletch';
      emailHtml = userWelcomeEmail({ userName });
    }

    await sendEmail({
      to: email,
      subject,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully',
    });

  } catch (error: any) {
    console.error('Welcome email error:', error);
    
    return NextResponse.json(
      { error: {  message: error.message || 'Failed to send welcome email'} },
      { status: 500 }
    );
  }
}