import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/supabaseAdmin';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { UserBase } from '@/type/user';
import { sendEmail } from '@/utils/email/send_email';
import { identityVerificationFailedBody, identityVerificationSuccessBody } from '@/utils/email/identity-verification';


export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const webhookData = JSON.parse(body);

    console.log('Plaid webhook received:', webhookData.webhook_type);

    switch (webhookData.webhook_type) {
      case 'IDENTITY_VERIFICATION': {
        await handleIdentityVerification(webhookData);
        break;
      }
      default:
        console.log('Unhandled webhook type:', webhookData.webhook_type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Plaid webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleIdentityVerification(webhookData: any) {
  const queryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");
  const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
  
  const { 
    identity_verification_id, 
    status, 
    steps, 
    documentary_verification, 
    selfie_check, 
    risk_check, 
    watchlist_screening 
  } = webhookData;

  console.log(`Identity verification ${identity_verification_id} status: ${status}`);


  let ourStatus = 'pending';
  if (status === 'success') ourStatus = 'success';
  else if (status === 'failed') ourStatus = 'failed';
  else if (status === 'expired') ourStatus = 'expired';
  else if (status === 'canceled') ourStatus = 'cancelled';
  else if (status === 'active') ourStatus = 'pending';

  const { data: verification, error: verificationError } = await supabaseAdmin
    .from('identity_verifications')
    .update({
      status: ourStatus,
      steps_completed: steps,
      documents_provided: documentary_verification,
      selfie_check: selfie_check,
      risk_check: risk_check,
      webhook_data: webhookData,
      updated_at: new Date().toISOString(),
    })
    .eq('plaid_identity_verification_id', identity_verification_id)
    .select()
    .single();

  if (verificationError) {
    console.error('Failed to update verification record:', verificationError);
    return;
  }

  if (verification) {
    const user = await userQueryBuilder.findById(verification.user_id);
    
    if (ourStatus === 'success') {
      await queryBuilder.update(verification.application_id, {
        kyc_status: ourStatus,
        kyc_session_id: identity_verification_id,
        kyc_result: steps,
        kyc_verified_at: new Date().toISOString(),
        stages_completed: {
          identity_verification: {
            completed: true,
            completed_at: new Date().toISOString(),
            status: ourStatus,
            data: {
              kyc_session_id: identity_verification_id,
              kyc_result: steps,
              kyc_status: ourStatus,
            }
          }
        },
        current_stage: 'terms_agreement',
        current_step: 7
      });
      
      if (user?.email) {
        await sendVerificationSuccessEmail(user, verification);
      }

    } else if (ourStatus === 'failed') {
      await queryBuilder.update(verification.application_id, {
        kyc_status: ourStatus,
        kyc_session_id: identity_verification_id,
        kyc_result: steps,
        stages_completed: {
          identity_verification: {
            completed: false,
            status: ourStatus,
          }
        }
      });

      if (user?.email) {
        await sendVerificationFailedEmail(user, verification, webhookData);
      }

    } else {
      
      await queryBuilder.update(verification.application_id, {
        kyc_status: ourStatus,
        kyc_session_id: identity_verification_id,
        kyc_result: steps,
        stages_completed: {
          identity_verification: {
            completed: false,
            status: 'pending',
          }
        }
      });
    }
  }
}

async function sendVerificationSuccessEmail(user: any, verification: any) {
  try {
    await sendEmail({
      to: user.email,
      subject: 'Identity Verification Successful - Ariveasy',
      html: identityVerificationSuccessBody({
        userName: user.name || user.email.split('@')[0],
        applicationId: verification.application_id,
        verificationDate: new Date().toISOString(),
      }),
    });
    console.log('✅ Verification success email sent to:', user.email);
  } catch (error) {
    console.error('Failed to send verification success email:', error);
  }
}

async function sendVerificationFailedEmail(user: any, verification: any, webhookData: any) {
  try {
    const { data: application } = await supabaseAdmin
      .from('applications')
      .select('identity_verification_attempts')
      .eq('id', verification.application_id)
      .single();
    
    const attemptNumber = application?.identity_verification_attempts || 1;
  
    let failureReason = 'Verification requirements not met';
    if (webhookData.documentary_verification?.status === 'failed') {
      failureReason = 'Document verification failed';
    } else if (webhookData.selfie_check?.status === 'failed') {
      failureReason = 'Selfie verification failed';
    } else if (webhookData.risk_check?.score === 'high') {
      failureReason = 'Risk assessment failed';
    }
    
    await sendEmail({
      to: user.email,
      subject: 'Action Required: Identity Verification - Ariveasy',
      html: identityVerificationFailedBody({
        userName: user.name || user.email.split('@')[0],
        applicationId: verification.application_id,
        failureReason,
        attemptNumber,
        maxAttempts: 3,
      }),
    });
    console.log('✅ Verification failure email sent to:', user.email);
  } catch (error) {
    console.error('Failed to send verification failure email:', error);
  }
}