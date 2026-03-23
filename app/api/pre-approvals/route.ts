import { CreateApplication } from "@/type/pages/dashboard/application";
import {PreApprovalBase } from "@/type/pages/dashboard/approval";
import { generateApplicationRefNo } from "@/utils/common/generateApplicationRef";
import { preApprovalAcceptedBody, preApprovalReceivedBody, preApprovalRejectedBody } from "@/utils/email/templates/pre-approval";
import { sendEmail } from "@/utils/email/send_email";
import { createNotification } from "@/utils/notifications/createNotification";
import { buildNotificationPayload } from "@/utils/notifications/notificationContent";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest } from "next/server";
import { UserBase } from "@/type/user";

const preApprovalHandlers = createCRUDHandlers<PreApprovalBase>({
  table: 'pre_approvals',
  searchFields:['user_name'],

  requiredFields: ['user_id', 'status', 'reference_number'],
    middleware:{
    auth:async(request:NextRequest)=>{
      const user = await requireAuth();
      return user ? {
        userId: user.id,
        email: user.email,
        role: user.app_metadata.role,
        name:user.user_metadata.name,
        auth: user.role ? true : false,

      } : null
    },
    permissions:async(action,context)=>{
      if (!context.auth?.userId) {
        return false;
      }

      return true
    }

  },
  hooks:{
    afterUpdate:async(created,_,context)=>{
      
      const userQB = new SupabaseQueryBuilder<UserBase>("users")

      if(created.completed_steps === 4 && created.current_step === 5 && context.auth?.role === 'user'){
        const user = await userQB.findById(created.user_id)

        if(user.id){{
          try {
            await sendEmail({
              to:  `${created.personal_info.email}`,
              subject: 'Pre-Approval Application Received',
              html: preApprovalReceivedBody({
                userName: `${user.name}`,
                referenceNumber: `${created.reference_number}`,
              }),
            });
          } catch (error) {
            console.error('Failed to send pre-approval received email:', error);
          }

          await createNotification(
            buildNotificationPayload('pre_approval_submitted', {
              user_id: created.user_id,
              pre_approval_id: created.id,
              type:'pre_approval_submitted',
              channel: 'in_app',
              metadata: {
                reference_number: created.reference_number,
                cta_url: `/user-dashboard/applications`,
              },
            })
          );
        }}
       
      }

      if(created.status === 'approved'&& context.auth?.role === 'admin'){
        try {
          const application = new SupabaseQueryBuilder<CreateApplication>("applications")
          const applicationNumber = generateApplicationRefNo("APP")
          const body = {
            application_number: applicationNumber,
            pre_approval_id: `${created.id}`,
            user_id: `${created.user_id}`,
            property_id: '0ca3e480-6a3e-4c47-bed0-637386b5f64c',
            property_name:"Placeholder Property",
            stages_completed: {
              personal_info: {
                completed: true,
                completed_at: new Date().toISOString(),
                status: "completed",
              },
              employment_info: {
                completed: true,
                completed_at: new Date().toISOString(),
                status: "completed",
              },
              documents_upload: {
                completed: true,
                completed_at: new Date().toISOString(),
                status: "completed",
              },
              property_preferences: {
                completed: true,
                completed_at: new Date().toISOString(),
                status: "completed",
              },
              identity_verification: {
                completed: false,
                completed_at: undefined,
                status: "current",
                retry_count: 0,
                data: {
                  updated_at:"",
                },
                kyc_status: undefined,
              },
              property_selection: {
                completed: false,
                completed_at: undefined,
                status: "upcoming",
              },
              terms_agreement: {
                completed: false,
                completed_at: undefined,
                status: "upcoming",
              },
              payment_setup: {
                completed: false,
                completed_at: undefined,
                status: "upcoming",
              },
              mortgage_activation: {
                completed: false,
                completed_at: undefined,
                status: "upcoming",
              },
            },
            current_step: 5,
            current_stage: "identity_verification",
            status: "in_progress",
            created_at: new Date().toISOString(),
          } satisfies Partial<CreateApplication>;

          await application.create(body)

          const user = await userQB.findById(created.user_id)

          if(user.id){
            try {
              await sendEmail({
                to:  `${created.personal_info.email}`,
                subject: 'Pre-Approval Application Feedbacks',
                html: preApprovalAcceptedBody({
                  userName: `${user.name}`,
                  referenceNumber: `${created.reference_number}`,
                }),
              });

              await createNotification(
                buildNotificationPayload('pre_approval_accepted', {
                  user_id: created.user_id,
                  pre_approval_id: created.id,
                  type:'pre_approval_accepted',
                  channel: 'in_app',
                  metadata: {
                    reference_number: created.reference_number,
                    cta_url: `/user-dashboard/applications`,
                  },
                })
              );
            } catch (error) {
              console.error('Failed to send pre-approval approval email:', error);
            }

          }

        } catch (error) {
          console.error('Failed to create application:', error);
        }
      }

      if(created.status === 'rejected' && context.auth?.role === 'admin'){
        const user = await userQB.findById(created.user_id)

        if(user.id){
          try {
            await sendEmail({
              to:  `${created.personal_info.email}`,
              subject: 'Pre-Approval Application Feedbacks',
              html:preApprovalRejectedBody({
                userName: `${user.name}`,
                referenceNumber: `${created.reference_number}`,
                rejectionReasons: created.rejection_reasons
              }),
            });
          } catch (error) {
            console.error('Failed to send pre-approval rejection feedback email:', error);
          }

          await createNotification(
            buildNotificationPayload('pre_approval_rejected', {
              user_id: created.user_id,
              pre_approval_id: created.id,
              type:'pre_approval_rejected',
              channel: 'in_app',
              metadata: {
                reference_number: created.reference_number,
                cta_url: `/user-dashboard/applications`,
              },
            })
          )
            
        }

      }

    }
  }
});

export const { GET, PUT, POST, PATCH } = preApprovalHandlers;

