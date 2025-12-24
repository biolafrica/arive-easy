import { createCRUDHandlers } from "@/utils/server/crudFactory";
import { sendEmail } from "@/utils/server/sendEmail";

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
      await sendEmail({
        to: createdSubscriber.email,
        subject: 'Subscription Successful 🎉',
        html: `
          <p>Hello ${createdSubscriber.email}</p>

          <p>Thank you for subscribing to our newsletter!</p>

          <p>You’ll now receive updates, insights, and announcements directly in your inbox.</p>

          <p>If you did not subscribe or wish to stop receiving emails, you can unsubscribe at any time.</p>

          <p>Welcome aboard 🚀</p>
        `,
      });
    },
  },

});

export const { POST } = handlers;