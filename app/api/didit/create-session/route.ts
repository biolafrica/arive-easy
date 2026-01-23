import { CreateSessionRequest, VerificationBase, VerificationType } from '@/type/common/didit';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { createVerificationSession } from '@/utils/didit';
import { requireAuth } from '@/utils/server/authMiddleware';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const queryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");
    const verificationQueryBuilder = new SupabaseQueryBuilder<VerificationBase>("identity_verifications");

    const body: CreateSessionRequest = await request.json();
    const { application_id, verification_type } = body;
    console.log("application_id received;", application_id, "verification type received", verification_type)

    if (!application_id || !verification_type) {
      return NextResponse.json(
        { error: 'Missing required fields: application_id, verification_type' },
        { status: 400 }
      );
    }

    if (!['home_country', 'immigration'].includes(verification_type)) {
      return NextResponse.json(
        { error: 'Invalid verification_type. Must be home_country or immigration' },
        { status: 400 }
      );
    }
  
    const application = await queryBuilder.findById(application_id)
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (application.processing_fee_payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Processing fee must be paid before verification' },
        { status: 400 }
      );
    }

    const existingVerification = await verificationQueryBuilder.findOneByCondition('application_id', application_id);
    const statusField = verification_type === 'home_country' ? 'home_country_status' : 'immigration_status';

    if (existingVerification) {
      const currentStatus = existingVerification[statusField];
      if (currentStatus === 'approved') {
        return NextResponse.json(
          { error: 'This verification is already completed' },
          { status: 400 }
        );
      }
      if (currentStatus === 'in_progress' || currentStatus === 'in_review') {
        return NextResponse.json(
          { error: 'Verification is already in progress' },
          { status: 400 }
        );
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.eatupng.com';
    const callbackUrl = `${baseUrl}/user-dashboard/applications/${application_id}/verification/callback`;

    const session = await createVerificationSession(
      application_id, verification_type as VerificationType, callbackUrl,
      { user_id: user.id }
    );

    console.log("session received", session);


    const sessionField = verification_type === 'home_country' ? 'home_country_session_id':'immigration_session_id';

    const updateData = {
      [sessionField]: session.session_id,
      [statusField]: 'not_started',
      updated_at: new Date().toISOString(),
    };

    if (existingVerification) {
      await verificationQueryBuilder.update(existingVerification.id, updateData)
    } else {
      await verificationQueryBuilder.create({
        application_id, user_id: user.id,
        home_country_status: 'not_started',
        immigration_status: 'not_started',
        overall_status: 'not_started',
        ...updateData,
      })
    }

    return NextResponse.json({
      success: true,
      url: session.url,
      session_id: session.session_id,
    });

  } catch (error) {
    console.error('Error creating Didit session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create verification session' },
      { status: 500 }
    );
  }
}