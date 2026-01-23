import { VerificationBase } from '@/type/common/didit';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { requireAuth } from '@/utils/server/authMiddleware';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const queryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");
    const verificationQueryBuilder = new SupabaseQueryBuilder<VerificationBase>("identity_verifications");
  
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Missing applicationId parameter' },
        { status: 400 }
      );
    }

    const application = await queryBuilder.findById(applicationId)
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const verification = await verificationQueryBuilder.findOneByCondition('application_id', applicationId)

    if (!verification) {
      console.error('Error fetching verification for this application');
      return NextResponse.json({
        success: true,
        home_country_status: 'not_started',
        immigration_status: 'not_started',
        overall_status: 'not_started',
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      home_country_status: verification.home_country_status,
      immigration_status: verification.immigration_status,
      overall_status: verification.overall_status,
      data: {
        home_country: {
          session_id: verification.home_country_session_id,
          status: verification.home_country_status,
          verified_at: verification.home_country_verified_at,
          document_type: verification.home_country_document_type,
          document_number: verification.home_country_document_number,
          expiry_date: verification.home_country_expiry_date,
        },
        immigration: {
          session_id: verification.immigration_session_id,
          status: verification.immigration_status,
          verified_at: verification.immigration_verified_at,
          document_type: verification.immigration_document_type,
          document_number: verification.immigration_document_number,
          country: verification.immigration_country,
          expiry_date: verification.immigration_expiry_date,
        },
        updated_at: verification.updated_at,
      },
    });

  } catch (error) {
    console.error('Error checking verification status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}