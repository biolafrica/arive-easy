import {PreApprovalBase } from "@/type/pages/dashboard/approval";
import { preApprovalAcceptedBody, preApprovalReceivedBody, preApprovalRejectedBody } from "@/utils/email/pre-approval";
import { sendEmail } from "@/utils/email/send_email";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";

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
        role: user.user_metadata.role,
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
      if(created.is_complete === true){
        try {
          await sendEmail({
            to:  `${context.auth?.email}`,
            subject: 'Pre-Approval Application Received',
            html: preApprovalReceivedBody({
              userName: `${context?.auth?.name}`,
              referenceNumber: `${created.reference_number}`,
            }),
          });
        } catch (error) {
          console.error('Failed to send pre-approval received email:', error);
        }
       
      }

      if(created.status === 'approved'){
        try {
          await sendEmail({
            to:  `${created.personal_info.email}`,
            subject: 'Pre-Approval Application Feedbacks',
            html: preApprovalAcceptedBody({
              userName: `${created.personal_info.first_name}`,
              referenceNumber: `${created.reference_number}`,
            }),
          });
          //create application
        } catch (error) {
          console.error('Failed to send pre-approval acceptance feedback email:', error);
        }
      }

      if(created.status === 'rejected'){
        try {
          await sendEmail({
            to:  `${created.personal_info.email}`,
            subject: 'Pre-Approval Application Feedbacks',
            html:preApprovalRejectedBody({
              userName: `${created.personal_info.first_name}`,
              referenceNumber: `${created.reference_number}`,
              rejectionReasons: created.rejection_reasons
            }),
          });
        } catch (error) {
          console.error('Failed to send pre-approval rejection feedback email:', error);
        }
      }

    }
  }
});

export const { GET, PUT, POST, PATCH } = preApprovalHandlers;
