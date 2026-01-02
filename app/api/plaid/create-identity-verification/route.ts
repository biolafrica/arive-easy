import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid-client';
import { IdentityVerificationCreateRequest, LinkTokenCreateRequest } from 'plaid';
import { requireAuth } from '@/utils/server/authMiddleware';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { PreApprovalBase } from '@/type/pages/dashboard/approval';
import { IdentityBase } from '@/type/pages/dashboard/identity';

export async function POST(request: NextRequest) {
  try {  
    const user = await requireAuth();
    const queryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");
    const ApprovalQueryBuilder = new SupabaseQueryBuilder<PreApprovalBase>("pre_approvals");
    const IdentityQueryBuilder = new SupabaseQueryBuilder<IdentityBase>("identity_verifications");

    const { application_id } = await request.json();

    const application = await queryBuilder.findOneByCondition({ 
      id: application_id,
      user_id: user.id,
    });

    console.log('Fetched application:', application);

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.processing_fee_payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Processing fee must be paid first' },
        { status: 400 }
      );
    }

    if (application.identity_verification_status === 'success') {
      return NextResponse.json(
        { error: 'Identity already verified for this application' },
        { status: 400 }
      );
    }

    const preApproval = await ApprovalQueryBuilder.findById(application.pre_approval_id);
    console.log('Fetched pre-approval:', preApproval);

    if (!preApproval) {
      return NextResponse.json(
        { error: 'Pre Approval data not found' },
        { status: 404 }
      );
    }

    const identityVerificationRequest: IdentityVerificationCreateRequest = {
      is_shareable: false,
      template_id: 'idvtmp_default',
      gave_consent: true,
      user: {
        client_user_id: user.id,
        email_address: user.email || undefined,
        phone_number: preApproval.personal_info.phone_number || undefined,
        date_of_birth: preApproval.personal_info.date_of_birth || undefined,
        name: {
          given_name: preApproval.personal_info.first_name,
          family_name: preApproval.personal_info.last_name,
        },

        address: preApproval.personal_info.address ? {
          street: preApproval.personal_info.address.street,
          street2: preApproval.personal_info.address.street2 || undefined,
          city: preApproval.personal_info.address.city,
          region: preApproval.personal_info.address.state,
          postal_code: preApproval.personal_info.address.postal_code,
          country: preApproval.personal_info.address.country || 'CA',
        } : undefined,
      },
    };
    console.log('Creating identity verification with request:', identityVerificationRequest);

    const identityVerificationResponse = await plaidClient.identityVerificationCreate(
      identityVerificationRequest
    );
    console.log('Created identity verification:', identityVerificationResponse.data);

    const identityVerificationId = identityVerificationResponse.data.id;
    console.log('Identity Verification ID:', identityVerificationId);

    const linkTokenRequest: LinkTokenCreateRequest = {
      user: {
        client_user_id: user.id,
        email_address: user.email || undefined,
        phone_number: preApproval.personal_info.phone_number || undefined,
        date_of_birth: preApproval.personal_info.date_of_birth || undefined,
        name: {
          given_name: preApproval.personal_info.first_name,
          family_name: preApproval.personal_info.last_name,
        },
        address: preApproval.personal_info.address ? {
          street: preApproval.personal_info.address.street,
          street2: preApproval.personal_info.address.street2 || undefined,
          city: preApproval.personal_info.address.city,
          region: preApproval.personal_info.address.state,
          postal_code: preApproval.personal_info.address.postal_code,
          country: preApproval.personal_info.address.country || 'CA',
        } : undefined,
        id_number: undefined
      },
      
      client_name: 'Kletch',
      products: ['identity_verification'] as any,
      identity_verification: {
        template_id: 'idvtmp_default',
        identity_verification_id: identityVerificationId,
      } as any,
      country_codes: (process.env.PLAID_COUNTRY_CODES?.split(',') || ['CA', 'US', 'GB', 'NG']) as any,
      language: 'en',
      webhook: process.env.PLAID_WEBHOOK_URL || undefined,
    };
    console.log('Creating link token with request:', linkTokenRequest);

    const linkTokenResponse = await plaidClient.linkTokenCreate(linkTokenRequest);
    console.log('Created link token:', linkTokenResponse.data);

    const newIdentity = await IdentityQueryBuilder.create({
      user_id: user.id,
      application_id: application_id,
      plaid_identity_verification_id: identityVerificationId,
      plaid_link_session_id: linkTokenResponse.data.link_token,
      status: 'pending',
      verification_type: 'identity_verification',
    });
    console.log('Saved identity verification record:', newIdentity);

    if (!newIdentity) {
      console.error('Failed to save verification record');
    }

    await queryBuilder.update(application_id, {
      identity_verification_status: 'pending',
      updated_at: new Date().toISOString(),
    });
    console.log('Updated application identity verification status to pending');

    return NextResponse.json({
      linkToken: linkTokenResponse.data.link_token,
      identityVerificationId,
      expirationTime: linkTokenResponse.data.expiration,
    });

  } catch (error: any) {
    console.error('Identity verification creation error:', error);
    
    if (error.response?.data) {
      return NextResponse.json(
        { error: error.response.data.error_message || 'Plaid error' },
        { status: error.response.status || 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create identity verification session' },
      { status: 500 }
    );
  }
}