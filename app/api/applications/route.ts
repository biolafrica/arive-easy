import { ApplicationBase } from "@/type/pages/dashboard/application";
import { OfferBase } from "@/type/pages/dashboard/offer";
import { PropertyBase, PropertyStatus,} from "@/type/pages/property";
import { UserBase } from "@/type/user";
import { sendEmail } from "@/utils/email/send_email";
import { offerNotificationBody } from "@/utils/email/templates/application";
import { createNotification } from "@/utils/notifications/createNotification";
import { buildNotificationPayload } from "@/utils/notifications/notificationContent";
import { requireAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { SupabaseQueryBuilder } from "@/utils/supabase/queryBuilder";
import { NextRequest } from "next/server";


const applicationHandlers = createCRUDHandlers<ApplicationBase>({
  table: 'applications',
  requiredFields: ['user_id', 'pre_approval_id', 'application_number'],
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
        role: user.app_metadata.role,
        name: user.user_metadata.name,
        auth: user.role ? true : false,
      } : null;
    },
    permissions: async (action, context) => {
      const role = context.auth?.role;
      const userId = context.auth?.userId;

      if (!role || !userId) return false;
      switch (role) {
        case 'user':
          return true;
        case 'seller':
          return action === 'read' || action === 'list';
        case 'support':
          return action === 'read' || action === 'list';
        case 'admin':
          return true;
        default:
          return false;
      }
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

            await updateProperty(updated.property_id, 'offers')

          }

          const user = await userQueryBuilder.findById(property.developer_id || '')
          
          if (user?.email) {

            try {
              await sendEmail({
                to:  `${user.email}`,
                subject: `Offer for ${property.title}`,
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

            await createNotification(
              buildNotificationPayload('offer_received', {
                user_id:user.id,
                application_id: updated.id,
                property_id:updated.property_id,
                type:'offer_received',
                channel: 'in_app',
                metadata: {
                  reference_number: updated.application_number,
                  application_number: updated.id,
                  cta_url: `/seller-dashboard/offers`,
                   property_name:updated.property_name 
                },
              })
            );

          }
          
        } catch (error) {
          console.error('Error in afterUpdate hook:', error);
        }
      }
 
    }
  }

});

async function updateProperty(id: string, status: PropertyStatus) {

  const propertyQueryBuilder = new SupabaseQueryBuilder<PropertyBase>("properties");

  const property = await propertyQueryBuilder.findById(id)
  if (!property) {
    console.error('Failed to fetch property for offer creation:');
    return;
  }

  await propertyQueryBuilder.update(property.id,{
    offers: (property.offers || 0) + 1,
    status
  })
}


export const { GET, PUT,} = applicationHandlers;