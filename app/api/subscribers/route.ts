import { sendEmail } from "@/utils/email/send_email";
import { SubscriptionEmail } from "@/utils/email/templates/support";
import { optionalAuth } from "@/utils/server/authMiddleware";
import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { NextRequest } from "next/server";

interface Subscriber {
  id: string;
  email: string;
  is_active: boolean;
}

const handlers = createCRUDHandlers<Subscriber>({
  table: 'subscribers',
  requiredFields: ['email'],
  searchFields: ['email', 'name'],

  middleware:{
    auth: async (request: NextRequest) => {
      const user = await optionalAuth();
      return user ? {
        userId: user.id,
        email: user.email,
        role: user.app_metadata.role,
        name: user.user_metadata.name,
        auth: user.role ? true : false,
      } : null;
    },
    permissions: async (action, context) => {
      if (action === 'create' || action === 'read' || action === 'list') return true;

      if (!context.auth?.userId) return false;
      return context.auth?.role === 'admin';
    },

  },

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