
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/utils/server/authMiddleware';
import { adminSellerNotificationEmail, sellerWelcomeEmail, userWelcomeEmail } from '@/utils/email/templates/welcome';
import { sendEmail } from '@/utils/email/send_email';
import { createNotification } from '@/utils/notifications/createNotification';
import { buildNotificationPayload } from '@/utils/notifications/notificationContent';
import { NotificationType } from '@/type/pages/dashboard/notification';

export async function POST(request: NextRequest) {
  try {
    
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
    let topic: NotificationType;

    if (role === 'seller' || role === 'agent') {
      subject = 'Welcome to Kletch - Start Listing Properties';
      emailHtml = sellerWelcomeEmail({ sellerName: userName });
      topic = 'account_setup';

      await sendEmail({
        to: 'biolafrica@gmail.com',
        subject: 'New Seller Alert',
        html: adminSellerNotificationEmail({
          sellerEmail: email,
          sellerId: user.id,
          sellerName:userName
        }),
      });

    } else {
      subject = 'Welcome to Kletch';
      emailHtml = userWelcomeEmail({ userName });
      topic = 'account_created'
    }

    await sendEmail({
      to: email,
      subject,
      html: emailHtml,
    });

    await createNotification(
      buildNotificationPayload(topic, {
        user_id: user.id,
        type: topic,
        channel: 'in_app',
        metadata: {
          property_name : userName,
        },
      })
    )

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