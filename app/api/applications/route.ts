import { ApplicationBase } from "@/type/pages/dashboard/application";
import { OfferBase } from "@/type/pages/dashboard/offer";
import { PropertyBase } from "@/type/pages/property";
import { UserBase } from "@/type/user";
import { offerNotificationBody } from "@/utils/email/application";
import { sendEmail } from "@/utils/email/send_email";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest } from "next/server";

const applicationHandlers = createCRUDHandlers<ApplicationBase>({
  table: 'applications',
  requiredFields: ['user_id', 'pre_approval_id', 'application_number'],
  searchFields: ['property_id', 'application_number'],
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
      const propertyQueryBuilder = new SupabaseQueryBuilder<PropertyBase>("properties");
      const offerQueryBuilder = new SupabaseQueryBuilder<OfferBase>("offers");
      const userQueryBuilder = new SupabaseQueryBuilder<UserBase>('users');

      const currentStageData = updated.stages_completed?.property_selection?.data;

      if ( currentStageData?.status === 'sent' && updated.property_id) {
        try {

          const property = await propertyQueryBuilder.findById(updated.property_id)
          if (!property) {
            console.error('Failed to fetch property for offer creation:');
            return;
          }

          const existingOffer = await offerQueryBuilder.findOneByCondition({
            application_id:updated.id,
            property_id:updated.property_id
          })

          if (existingOffer) {
            await offerQueryBuilder.update(existingOffer.id,{
              status: 'pending',
              rejection_note: "",
              updated_at: new Date().toISOString()
            })

          } else {
            const offerData: Partial<OfferBase> = {
              user_id: updated.user_id,
              application_id: updated.id,
              property_id: updated.property_id,
              property_name: currentStageData.property_name || property.title,
              amount: String(updated.property_price || property.price),
              status: 'pending',
              type: currentStageData.type || 'mortgage',
              developer_id: property.developer_id || '',
              created_at: new Date().toISOString(),
            };

            const offer = await offerQueryBuilder.create(offerData)
            if (!offer) {
              console.error('Failed to create offer');
            }
          }

          const user = await userQueryBuilder.findById(property.developer_id || '')
          
          if (user?.email) {
            try {
              await sendEmail({
                to:  `${user.email}`,
                subject: 'Property Offer Feedback',
                html: offerNotificationBody({
                  sellerName: user.name,
                  propertyId: property.id,
                  propertyName:property.title,
                  offerAmount:property.price,
                }),
              });
            } catch (error) {
              console.error('Failed to send seller offer notificatio:', error);
            }

          }
          
        } catch (error) {
          console.error('Error in afterUpdate hook:', error);
        }
      }
    }
  }
});

export const { GET, PUT, POST, PATCH } = applicationHandlers;