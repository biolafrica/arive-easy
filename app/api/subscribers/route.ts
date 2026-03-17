import { sendEmail } from "@/utils/email/send_email";
import { SubscriptionEmail } from "@/utils/email/templates/support";
import { createCRUDHandlers } from "@/utils/server/crudFactory";

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
}

const handlers = createCRUDHandlers<Subscriber>({
  table: 'subscribers',
  requiredFields: ['email'],
  searchFields: ['email', 'name'],

  hooks: {
    afterCreate: async (createdSubscriber) => {
      try {
        await sendEmail({
          to:  createdSubscriber.email,
          subject: 'Subscription Successful',
          html: SubscriptionEmail ({
            email:createdSubscriber.email
          }),
        });
      } catch (error) {
        console.error('Failed to send successful subscription email:', error);
      }
    
    },
  },

});

export const { POST } = handlers;