import { DocumentUploadType,} from "@/type/pages/dashboard/approval";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { sendEmail } from "@/utils/server/sendEmail";
import { NextRequest } from "next/server";

const propertyHandlers = createCRUDHandlers<DocumentUploadType>({
  table: 'pre_approval-documents',
  requiredFields: ['identity_type', 'identity_proof', 'payslip_start_date', 'payslip_end_date', 'payslip_image', 
    ' bank_statement_start_date', 'bank_statement_end_date','bank_statement_image',
  ],

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
    afterCreate:async(created,_,context)=>{
      await sendEmail({ 
        to: `${context.auth?.email}`,
        subject: "Pre-Approval Application Received",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Your Pre-approval Has Been Received!</h1>
            <p>Dear ${context?.auth?.name},</p>
            <p>
              We've successfully received your mortgage pre-approval application. Our team is now reviewing your information.

              What Happens Next:
              - Our team will review your application within 24-48 hours
              - You'll receive an email with your pre-approval decision
              - If approved, you can proceed to select properties within your approved range

              Need Help?
              Email: info@ariveasy.com

              Best regards,
              The Ariveasy Team
             
            </p>
          </div>
        `,
      }).catch(error => {
        console.error("Failed to send Approval email:", error);
      });

    }
  }
});

export const { GET, PUT, POST, PATCH } = propertyHandlers;