import { CreateSessionRequest, VerificationBase, VerificationType } from '@/type/common/didit';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { createVerificationSession, getVerificationSession } from '@/utils/server/didit';
import { requireAuth } from '@/utils/server/authMiddleware';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/server/logger';

const ROUTE_CONTEXT = { component: 'didit', action: 'create_session' };

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

    logger.info(`Create session request received`, {
      ...ROUTE_CONTEXT,
      applicationId: application_id,
      verificationType: verification_type,
    });

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

    const application = await queryBuilder.findById(application_id);
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

      const isResumable = ['in_progress', 'in_review', 'not_finished'].includes(currentStatus);
      if (isResumable) {
        const sessionIdField = verification_type === 'home_country'
          ? 'home_country_session_id'
          : 'immigration_session_id';
        const existingSessionId = existingVerification[sessionIdField];

        if (existingSessionId) {
          try {
            const existingSession = await getVerificationSession(existingSessionId);

            if (existingSession?.url || existingSession?.session_url) {
              logger.info(`Resuming existing session ${existingSessionId}`, {
                ...ROUTE_CONTEXT,
                applicationId: application_id,
                sessionId: existingSessionId,
              });
              return NextResponse.json({
                success: true,
                url: existingSession.url || existingSession.session_url,
                session_id: existingSessionId,
                resumed: true,
              });
            }
          } catch (sessionError) {
            logger.warn(`Could not retrieve session ${existingSessionId}, creating new one`, {
              ...ROUTE_CONTEXT,
              applicationId: application_id,
              sessionId: existingSessionId,
            });
          }
        }
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.usekletch.com';
    const callbackUrl = `${baseUrl}/user-dashboard/applications/${application_id}/verification/callback`;

    const session = await createVerificationSession(
      application_id, verification_type as VerificationType, callbackUrl,
      { user_id: user.id }
    );

    const sessionField = verification_type === 'home_country' ? 'home_country_session_id' : 'immigration_session_id';

    const updateData = {
      [sessionField]: session.session_id,
      [statusField]: 'not_started',
      updated_at: new Date().toISOString(),
    };

    if (existingVerification) {
      await verificationQueryBuilder.update(existingVerification.id, updateData);
    } else {
      await verificationQueryBuilder.create({
        application_id, user_id: user.id,
        home_country_status: 'not_started',
        immigration_status: 'not_started',
        overall_status: 'not_started',
        ...updateData,
      });
    }

    logger.info(`Verification session created`, {
      ...ROUTE_CONTEXT,
      applicationId: application_id,
      sessionId: session.session_id,
      verificationType: verification_type,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      session_id: session.session_id,
    });

  } catch (error) {
    logger.error(error, 'Error creating Didit session', ROUTE_CONTEXT);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create verification session' },
      { status: 500 }
    );
  }
}