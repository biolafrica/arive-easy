import { ApplicationBase } from "@/type/pages/dashboard/application";
import { OfferBase } from "@/type/pages/dashboard/offer";
import { UserBase } from "@/type/user";
import { sendOfferAcceptedEmail, sendOfferDeclinedEmail } from "@/utils/email/offers";
import { sendEmail } from "@/utils/email/send_email";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest } from "next/server";

const offersHandlers = createCRUDHandlers<OfferBase>({
  table: 'offers',
  requiredFields: ['user_id', 'application_id'],
  searchFields: ['property_name'],
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
    }
  },
  hooks: {
    afterUpdate: async (updated, previous, context) => {
      const applicationQueryBuilder = new SupabaseQueryBuilder<ApplicationBase>("applications");
      const userQueryBuilder = new SupabaseQueryBuilder<UserBase>("users");

      console.log("data after update",updated)
      console.log("data before update",previous)
      console.log("seller that rejected the offer",context.auth)


      try {
        const application = await applicationQueryBuilder.findById(updated.application_id)
        console.log("checked application")
        if (!application) {
          console.error('Failed to fetch application');
          return;
        }

        const user = await userQueryBuilder.findById(updated.user_id)
        console.log("checked user, so it is not application")
      
        if (updated.status === 'accepted') {

          const updatedApplication = await applicationQueryBuilder.update(updated.application_id,{
            stages_completed: {
              ...application.stages_completed,
              property_selection: {
                completed: true,
                completed_at: new Date().toISOString(),
                status: 'completed',
                data: {
                  ...application.stages_completed?.property_selection?.data,
                  status: 'approved',
                  reason: 'Property selection approved by seller'
                }
              },
              terms_agreement:{
                completed: false,
                status: "current",
                completed_at: '',
                data:null
              }
            },
            current_stage: 'terms_agreement',
            current_step: 7,
            updated_at: new Date().toISOString()
          })

          console.log("updated application, so it is not user")
           
          if (!updatedApplication) {
            console.error('Failed to update application on offer accept');
          }

          if (user?.email) {
            try {
              await sendEmail({
                to:  `${user.email}`,
                subject: 'Property Offer Feedback',
                html: sendOfferAcceptedEmail({
                  userName: user.name,
                  applicationNumber: application.application_number,
                  propertyName:updated.property_name,
                  offerAmount:updated.amount
                }),
              });
            } catch (error) {
              console.error('Failed to send offer accepted email:', error);
            }
          }

        } else if (updated.status === 'declined') {
          const updatedApplication = await applicationQueryBuilder.update(updated.application_id,{
            property_id: '0ca3e480-6a3e-4c47-bed0-637386b5f64c',
            property_price: 0,
            stages_completed: {
              ...application.stages_completed,
              property_selection: {
                completed: false,
                completed_at: '',
                status: 'current', 
                data: {
                  ...application.stages_completed?.property_selection?.data,
                  status: 'declined',
                  reason: updated.rejection_note || 'Property selection declined by seller'
                }
              }
            },
            updated_at: new Date().toISOString()
          })

          if (!updatedApplication) {
            console.error('Failed to update application on offer decline');
          }

          if (user?.email) {
            try {
              await sendEmail({
                to:  `${user.email}`,
                subject: 'Property Offer Feedback',
                html: sendOfferDeclinedEmail({
                  userName: user.name,
                  applicationNumber: application.application_number,
                  propertyName:updated.property_name,
                  offerAmount:updated.amount,
                  reason:updated.rejection_note
                }),
              });
            } catch (error) {
              console.error('Failed to send offer accepted email:', error);
            }

          }

        }

      } catch (error) {
        console.error('Error in offers afterUpdate hook:', error);
      }
    }
  }
});

export const { GET, PUT, POST, PATCH } = offersHandlers;
