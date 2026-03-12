import { ApplicationBase } from "@/type/pages/dashboard/application";
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { UserBase } from "@/type/user";
import { sendEmail } from "@/utils/email/send_email";
import { documentUploadNotificationEmail } from "@/utils/email/templates/document";
import { sendOfferAcceptedEmail } from "@/utils/email/templates/offers";
import { createNotification } from "@/utils/notifications/createNotification";
import { buildNotificationPayload } from "@/utils/notifications/notificationContent";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest} from "next/server";

const transactionTemplateHandlers = createCRUDHandlers<TransactionDocumentBase>({
  table: 'document_transactions',
  requiredFields: ['application_id', 'generated_document_url'],
  defaultSort: {
    field: 'created_at',
    order: 'desc'
  },
  middleware: {
    auth: async (request: NextRequest) => {
      const user = await requireAuth();
      return user ? {
        userId: user.id,
        email: user.email,
        role: user.user_metadata.role,
        name: user.user_metadata.name,
        auth: user.role ? true : false,
      } : null;
    },
    permissions: async (action, context) => {
      if (!context.auth?.userId) {
        return false;
      }
      return true;
    },
  
  },
  hooks:{
    beforeCreate:async(body, context)=>{
      const transactionDocumentQB = new SupabaseQueryBuilder<TransactionDocumentBase>('document_transactions'); 
      const applicationQB = new SupabaseQueryBuilder<ApplicationBase>('applications');
      const userQB = new SupabaseQueryBuilder<UserBase>('users')

      try {

        const previousTransactionTemplate = await transactionDocumentQB.findOneByCondition({
          application_id: body.application_id,
          document_type:body.document_type
        });

        if(previousTransactionTemplate){
          throw new Error( `you already created ${body.document_type} for this application`)
        }

        const application = await applicationQB.findById(body.application_id)
        if(!application){
          throw new Error('application not found')
        }

        const now = new Date().toISOString();

        body.created_at = now;
        body.updated_at = now;
        body.status = 'completed'
        body.buyer_id = application.user_id
        body.seller_id =application.developer_id
        body.property_id = application.property_id
        body.esign_provider = 'static'

        const user = await userQB.findById(application.user_id)
       
        if(user?.email){
          try {
            await sendEmail({
              to:  `${user.email}`,
              subject: 'Property Documents Available - Kletch',
              html: documentUploadNotificationEmail({
                userName: user.name,
                applicationNumber: application.application_number,
                propertyName:application.property_name,
                uploadedDocuments:{
                  name:`${application.property_name} '' ${body.document_type}`,
                  type:body.document_type,
                  uploadDate:now,
                }
              }),
            });

            await createNotification(
              buildNotificationPayload('document_submitted', {
                user_id:user.id,
                application_id: application.id,
                property_id:application.property_id,
                type:'document_submitted',
                channel: 'in_app',
                metadata: {
                  currency:body.document_type,
                  cta_url: `https://www.usekletch.com/user-dashboard/applications`,
                  property_name:application.property_name 
                },
              })
            );

          } catch (error) {
            console.error('Failed to send notification email:', error);
          }
        }
      

      } catch (error) {
        console.error('transactional Document create hook:', error);
        
      }
         
    }
    
  }
  
});

export const { GET, PUT, POST, PATCH } = transactionTemplateHandlers;