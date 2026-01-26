import { DiditWebhookPayload, VerificationBase } from '@/type/common/didit';
import { ApplicationBase } from '@/type/pages/dashboard/application';
import { UserBase } from '@/type/user';
import { calculateOverallStatus, mapDiditStatus, parseVendorData, verifyStructuredSignature, verifyWebhookSignature } from '@/utils/didit';
import { identityVerificationDeclineBody, identityVerificationSuccessBody } from '@/utils/email/identity-verification';
import { sendEmail } from '@/utils/email/send_email';
import { SupabaseQueryBuilder } from '@/utils/supabase/queryBuilder';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {

    const rawBody = await request.text();

    const verificationQueryBuilder = new SupabaseQueryBuilder<VerificationBase>("identity_verifications");
    const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");
    const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");
    
    const signature = request.headers.get('X-Signature') || '';
    const timestamp = request.headers.get('X-Timestamp') || '';
    const structuredSignature = request.headers.get('X-Signature-Structured') || '';

    let payload: DiditWebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error('Invalid JSON in webhook body');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    let isValid = false;

    if (structuredSignature && payload.session_id && payload.status && payload.created_at) {
      isValid = verifyStructuredSignature(
        payload.session_id, payload.status,
        payload.created_at,structuredSignature
      );
    }

    if (!isValid && signature && timestamp) {
      isValid = verifyWebhookSignature(rawBody, signature, timestamp);
    }

    if (!isValid && process.env.NODE_ENV === 'development') {
      console.warn('Skipping signature verification in development');
      isValid = true;
    }

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { applicationId, verificationType } = parseVendorData(payload.vendor_data);
    
    if (!applicationId || !verificationType) {
      console.error('Invalid vendor_data:', payload.vendor_data);
      return NextResponse.json({ error: 'Invalid vendor_data' }, { status: 400 });
    }

    const internalStatus = mapDiditStatus(payload.status);

    console.log(`Webhook received for application ${applicationId}:`, {
      verificationType,
      status: internalStatus,
      sessionId: payload.session_id,
    });

    const verification = await verificationQueryBuilder.findOneByCondition('application_id', applicationId);
    console.log('findbyapplication id condition', verification)

    if (!verification) {
      console.error('Verification record not found');
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 });
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };


    if (verificationType === 'home_country') {
      updateData.home_country_status = internalStatus;
      
      if (internalStatus === 'approved') {
        updateData.home_country_verified_at = new Date().toISOString();
        
        const idVerification = payload.decision?.id_verifications?.[0];
        
        if (idVerification) {
          updateData.home_country_document_type = idVerification.document_type;
          updateData.home_country_document_number = idVerification.document_number;
          updateData.home_country_expiry_date = idVerification.expiration_date; 
          updateData.home_country_kyc_data = {
            first_name: idVerification.first_name,
            last_name: idVerification.last_name,
            full_name: idVerification.full_name,
            date_of_birth: idVerification.date_of_birth,
            nationality: idVerification.nationality,
            gender: idVerification.gender,
            issuing_state: idVerification.issuing_state,
            issuing_state_name: idVerification.issuing_state_name,
            place_of_birth: idVerification.place_of_birth,
            date_of_issue: idVerification.date_of_issue,
            age: idVerification.age,
            portrait_image: idVerification.portrait_image,
            extra_fields: idVerification.extra_fields,
          };
        }

        const faceMatch = payload.decision?.face_matches?.[0];
        if (faceMatch) {
          updateData.home_country_kyc_data = {
            ...updateData.home_country_kyc_data,
            face_match_score: faceMatch.score,
            face_match_status: faceMatch.status,
          };
        }

        const liveness = payload.decision?.liveness_checks?.[0];
        if (liveness) {
          updateData.home_country_kyc_data = {
            ...updateData.home_country_kyc_data,
            liveness_score: liveness.score,
            liveness_method: liveness.method,
            age_estimation: liveness.age_estimation,
          };
        }

        const currentApplication = await applicationQueryBuilder.findById(applicationId)

        if (!currentApplication) {
          console.error('Application not found');
          return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        await applicationQueryBuilder.update(applicationId,{
          stages_completed:{
            ...currentApplication.stages_completed,
            identity_verification:{
              ...currentApplication.stages_completed.identity_verification,
              status:'current',
              completed:false,
              data:{
                ...currentApplication.stages_completed.identity_verification?.data,
                home_country_session_id:payload.session_id,
                home_country_document_type:idVerification?.document_type,
                home_country_document_number:idVerification?.document_number,
                home_country_expiry_date:idVerification?.expiration_date,
                home_country_status:"approved",
                home_country_verified_at:new Date().toISOString(),
                updated_at:new Date().toISOString()
              }
            },
          }
        })
      }

    } else if (verificationType === 'immigration') {
      updateData.immigration_status = internalStatus;
      
      if (internalStatus === 'approved') {
        updateData.immigration_verified_at = new Date().toISOString();
        
        const idVerification = payload.decision?.id_verifications?.[0];
        
        if (idVerification) {
          updateData.immigration_document_type = idVerification.document_type;
          updateData.immigration_document_number = idVerification.document_number;
          updateData.immigration_country = idVerification.issuing_state; 
          updateData.immigration_expiry_date = idVerification.expiration_date;
          
          updateData.immigration_kyc_data = {
            first_name: idVerification.first_name,
            last_name: idVerification.last_name,
            full_name: idVerification.full_name,
            date_of_birth: idVerification.date_of_birth,
            nationality: idVerification.nationality,
            issuing_state_name: idVerification.issuing_state_name,
            date_of_issue: idVerification.date_of_issue,
            portrait_image: idVerification.portrait_image,
          };
        }

        const faceMatch = payload.decision?.face_matches?.[0];
        if (faceMatch) {
          updateData.immigration_kyc_data = {
            ...updateData.immigration_kyc_data,
            face_match_score: faceMatch.score,
          };
        }


        const currentApplication = await applicationQueryBuilder.findById(applicationId)

        if (!currentApplication) {
          console.error('Application not found');
          return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        await applicationQueryBuilder.update(applicationId,{
          stages_completed:{
            ...currentApplication.stages_completed,
            identity_verification:{
              ...currentApplication.stages_completed.identity_verification,
              status:'current',
              completed:false,
              data:{
                ...currentApplication.stages_completed.identity_verification?.data,
                immigration_session_id:payload.session_id,
                immigration_document_type:idVerification?.document_type,
                immigration_document_number:idVerification?.document_number,
                immigration_expiry_date:idVerification?.expiration_date,
                immigration_status:"approved",
                immigration_verified_at:new Date().toISOString(),
                updated_at:new Date().toISOString()
              }
            },
          }
        })

      }
    }

    const homeStatus = verificationType === 'home_country' ? internalStatus : verification.home_country_status;
    const immigrationStatus = verificationType === 'immigration' ? internalStatus : verification.immigration_status;

    updateData.overall_status = calculateOverallStatus(homeStatus, immigrationStatus);

    const updateVerification = await verificationQueryBuilder.update(verification.id, updateData)

    if (!updateVerification) {
      console.error('Failed to update verification:');
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }

    const user = await userQueryBuilder.findById(updateVerification.user_id)
    console.log("payload received", payload);

    if (updateData.overall_status === 'approved') {

      const currentApplication = await applicationQueryBuilder.findById(applicationId)

      if (!currentApplication) {
        console.error('Application not found');
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      const application = await applicationQueryBuilder.update(applicationId,{
        identity_verification_status:'approved',
        identity_verification_completed_at: new Date().toISOString(),
        current_stage: 'property_selection',
        current_step: 6,
        stages_completed:{
          ...currentApplication.stages_completed,
          identity_verification:{
            ...currentApplication.stages_completed.identity_verification,
            completed:true,
            completed_at:new Date().toISOString(),
            status:'completed',
            kyc_status:'success',
          },
          property_selection:{
            ...currentApplication.stages_completed.property_selection,
            status:'current',
            completed:false
          }
        }
      })

      try {
        await sendEmail({
          to: user.email,
          subject: 'Identity Verification Complete - Kletch',
          html: identityVerificationSuccessBody({
            userName: user.name || 'Valued Customer',
            applicationId: applicationId,
            verificationDate: new Date().toISOString(),
          }),
        });
      } catch (emailError) {
        console.error('Failed to send success email:', emailError);
      }

      console.log(`Identity verification completed for application ${applicationId}`);
    }

    if (internalStatus === 'declined') {
      const currentApplication = await applicationQueryBuilder.findById(applicationId);
      const idVerification = payload.decision?.id_verifications?.[0];
      
      // Get the first warning with an error log_type, or the first warning overall
      const errorWarning = idVerification?.warnings?.find(w => w.log_type === 'error') 
        || idVerification?.warnings?.[0];
      
      const errorMessage = errorWarning?.long_description 
        || errorWarning?.short_description 
        || 'Verification failed. Please try again with clearer documents.';

      if (!currentApplication) {
        console.error('Application not found');
        return NextResponse.json({ error: 'Application not found' }, { status: 404 });
      }

      const updatedData: any = {
        ...currentApplication.stages_completed.identity_verification?.data,
        updated_at: new Date().toISOString(),
      };

      if (verificationType === 'home_country') {
        updatedData.home_country_status = 'declined';
        updatedData.home_country_error_message = errorMessage;
      } else {
        updatedData.immigration_status = 'declined';
        updatedData.immigration_error_message = errorMessage;
      }

      await applicationQueryBuilder.update(applicationId, {
        identity_verification_status: 'failed',
        stages_completed: {
          ...currentApplication.stages_completed,
          identity_verification: {
            ...currentApplication.stages_completed.identity_verification,
            completed: false,
            status: 'current', 
            kyc_status: 'failed',
            error_message: errorMessage,
            data: updatedData,
          }
        }
      });

      try {
        await sendEmail({
          to: user.email,
          subject: 'Identity Verification - Action Required',
          html: identityVerificationDeclineBody({
            userName:user.name,
            referenceNumber:applicationId,
            canResubmit:false,
            declineReasons:errorMessage
          })
        });

      } catch (emailError) {
        console.error('Failed to send failure email:', emailError);
      }

      console.log(`Identity verification failed for application ${applicationId}`);
    }

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      status: updateData.overall_status,
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' });
}