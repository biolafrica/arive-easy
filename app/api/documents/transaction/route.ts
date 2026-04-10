import { ApplicationBase } from "@/type/pages/dashboard/application";
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { UserBase } from "@/type/user";
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";
import { sendEmail } from "@/utils/email/send_email";
import { documentUploadNotificationEmail } from "@/utils/email/templates/document";
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
        role: user.app_metadata.role,
        name: user.user_metadata.name,
        auth: user.role ? true : false,
      } : null;
    },
    permissions: async (action, context) => {
      const role = context.auth?.role;
      const userId = context.auth?.userId;

      if (!userId) return false;
      switch (role) {
        case 'admin':
          return true;
        case 'seller':
          return action === 'read' || action === 'list' || action === 'create';
        case 'user':
          return action === 'read' || action === 'list';
        default:
          return false;
      }
    },
  
  },
  hooks:{
    beforeCreate:async(body, context)=>{
      const transactionDocumentQB = new SupabaseQueryBuilder<TransactionDocumentBase>('document_transactions'); 
      const applicationQB = new SupabaseQueryBuilder<ApplicationBase>('applications');

      const previousTransactionTemplate = await transactionDocumentQB.findOneByCondition({
        application_id: body.application_id,
        document_type:body.document_type
      });
      
      if(previousTransactionTemplate){
        throw new Error( `you already created ${humanizeSnakeCase(body.document_type)} for this application`)
      }

      const application = await applicationQB.findById(body.application_id)
      if(!application){
        throw new Error('application not found')
      }

      const now = new Date().toISOString();

      body.created_at = now;
      body.updated_at = now;
      body.sent_at = now;
      body.completed_at = now;
      body.status = 'completed'
      body.buyer_id = application.user_id
      body.seller_id =application.developer_id
      body.property_id = application.property_id
      body.esign_provider = 'static'

         
    },

    afterCreate:async(updated, previous, context)=>{
      const userQB = new SupabaseQueryBuilder<UserBase>('users')
      const applicationQB = new SupabaseQueryBuilder<ApplicationBase>('applications');

      try {
        const application = await applicationQB.findById(updated.application_id)
        if(!application){
          console.error('Application not found in afterCreate:', updated.application_id);
          return;
        }
    
        const currentStage = application.stages_completed.mortgage_activation;
        await applicationQB.update(application.id, {
          stages_completed: {
            ...application.stages_completed,
            mortgage_activation: {
              ...currentStage,
              status: currentStage?.status || 'current',
              completed: currentStage?.completed || false,
              data: {
                ...currentStage?.data,
                [updated.document_type]: true,
                [`${updated.document_type}_uploaded_at`]: new Date().toISOString(),
              }
            }
          }
        })
      
        const user = await userQB.findById(application.user_id)

        if (!user?.email) {
          console.warn('User or email not found, skipping notification');
          return;
        }

        await Promise.allSettled([
          sendEmail({
            to: user.email,
            subject: 'Property Documents Available - Kletch',
            html: documentUploadNotificationEmail({
              userName: user.name,
              applicationNumber: application.application_number,
              propertyName: application.property_name,
              uploadedDocuments: {
                name: `${application.property_name} - ${humanizeSnakeCase(updated.document_type)}`,
                type: updated.document_type,
                uploadDate: updated.created_at || '',
              }
            }),
          }),
          createNotification(
            buildNotificationPayload('document_submitted', {
              user_id: user.id,
              application_id: application.id,
              property_id: application.property_id,
              type: 'document_submitted',
              channel: 'in_app',
              metadata: {
                document_type: updated.document_type,
                cta_url: '/user-dashboard/applications',
                property_name: application.property_name
              },
            })
          )
        ]).then(results => {
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              const action = index === 0 ? 'email' : 'notification';
              console.error(`Failed to send ${action}:`, result.reason);
            } else {
              const action = index === 0 ? 'email' : 'notification';
              console.log(`Successfully sent ${action}`);
            }
          });
        });

      } catch (error) {
        console.error('Error in afterCreate hook:', error);
      }

    }
    
  }
  
});

export const { GET, PUT, POST,} = transactionTemplateHandlers;