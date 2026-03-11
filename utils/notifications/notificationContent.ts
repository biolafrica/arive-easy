import { NotificationType, CreateNotificationPayload } from '@/type/pages/dashboard/notification';

type ContentBuilder = (meta?: Record<string, string>) => {
  title: string;
  message: string;
};

export const NOTIFICATION_CONTENT: Record<NotificationType, ContentBuilder> = {
  pre_approval_submitted: () => ({
    title: 'Pre-approval submitted',
    message: 'Your pre-approval application has been received. Our team will review it within 24–48 hours.',
  }),

  pre_approval_accepted: (m) => ({
    title: 'Pre-approval approved',
    message: `Congratulations! Your pre-approval${m?.reference_number ? ` (${m.reference_number})` : ''} has been approved. You can now browse and select properties.`,
  }),

  pre_approval_rejected: (m) => ({
    title: 'Pre-approval not approved',
    message: `Unfortunately your pre-approval${m?.reference_number ? ` (${m.reference_number})` : ''} was not approved at this time. Please contact support for next steps.`,
  }),

  account_setup: (m) => ({
    title: `Welcome ${m?.property_name}`,
    message: 'Congratulations on taking the first step toward transforming your development business',
  }),

  account_created: (m) => ({
    title: 'Welcome to Kletch ',
    message: `Your dream of owning property back home is now within reach ${m?.property_name}.`,
  }),

  processing_fee_success: (m) => ({
    title: 'Processing fee paid',
    message: `Your processing fee${m?.amount ? ` of ${m.amount}` : ''} was received successfully.`,
  }),

  processing_fee_failed: (m) => ({
    title: 'Processing fee payment failed',
    message: `Your processing fee payment${m?.amount ? ` of ${m.amount}` : ''} could not be processed. Please update your payment method.`,
  }),

  kyc_approved: () => ({
    title: 'Identity verification approved',
    message: 'Your identity documents have been verified successfully. Your application is progressing.',
  }),

  kyc_rejected: () => ({
    title: 'Identity verification failed',
    message: 'We could not verify your identity documents. Please re-submit or contact support.',
  }),

  offer_accepted: (m) => ({
    title: 'Offer accepted!',
    message: `Your offer${m?.property_name ? ` on ${m.property_name}` : ''} has been accepted. Proceed to down payment to continue.`,
  }),

  offer_rejected: (m) => ({
    title: 'Offer not accepted',
    message: `Your offer${m?.property_name ? ` on ${m.property_name}` : ''} was declined by the seller. You can submit a new offer or choose another property.`,
  }),

  down_payment_success: (m) => ({
    title: 'Down payment received',
    message: `Your down payment${m?.amount ? ` of ${m.amount}` : ''} has been successfully processed and placed in escrow.`,
  }),

  down_payment_failed: (m) => ({
    title: 'Down payment failed',
    message: `Your down payment${m?.amount ? ` of ${m.amount}` : ''} could not be processed. Please try again or contact support.`,
  }),

  valuation_fee_success: (m) => ({
    title: 'Valuation fee paid',
    message: `Your valuation fee${m?.amount ? ` of ${m.amount}` : ''} has been received. Property valuation will begin shortly.`,
  }),

  valuation_fee_failed: (m) => ({
    title: 'Valuation fee payment failed',
    message: `Your valuation fee payment${m?.amount ? ` of ${m.amount}` : ''} failed. Please try again.`,
  }),

  legal_fee_success: (m) => ({
    title: 'Legal fee paid',
    message: `Your legal fee${m?.amount ? ` of ${m.amount}` : ''} has been received. Document preparation is underway.`,
  }),

  legal_fee_failed: (m) => ({
    title: 'Legal fee payment failed',
    message: `Your legal fee payment${m?.amount ? ` of ${m.amount}` : ''} failed. Please try again.`,
  }),
  terms_stage_completed: (m) => ({
    title: 'Terms Stage Completed!',
    message: `You have coompleted terms and agreement stage for ${m?.application_number}`,
  }),

  payment_stage_completed: (m) => ({
    title: 'Payment Stage Completed',
    message: `Your have coompleted payment stage for ${m?.application_number}`,
  }),

  document_signed: () => ({
    title: 'Documents signed',
    message: 'All documents have been signed. Your mortgage is being processed for final activation.',
  }),

  mortgage_activated: (m) => ({
    title: 'Mortgage activated',
    message: `Your mortgage${m?.property_name ? ` for ${m.property_name}` : ''} is now active. Your first payment is due${m?.due_date ? ` on ${m.due_date}` : ' next month'}.`,
  }),

  payment_reminder: (m) => ({
    title: 'Payment reminder',
    message: `Your mortgage payment${m?.amount ? ` of ${m.amount}` : ''} is due${m?.due_date ? ` on ${m.due_date}` : ' soon'}. Ensure your account has sufficient funds.`,
  }),

  subscription_payment_success: (m) => ({
    title: 'Monthly payment received',
    message: `Your mortgage payment${m?.amount ? ` of ${m.amount}` : ''} was processed successfully.`,
  }),

  subscription_payment_failed: (m) => ({
    title: 'Monthly payment failed',
    message: `Your mortgage payment${m?.amount ? ` of ${m.amount}` : ''} could not be processed. Please update your payment details to avoid late fees.`,
  }),


  offer_received: (m) => ({
    title: 'New offer received',
    message: `You have received a new offer${m?.property_name ? ` on ${m.property_name}` : ''}${m?.amount ? ` for ${m.amount}` : ''}. Review and respond in your dashboard.`,
  }),

  down_payment_received: (m) => ({
    title: 'Down payment confirmed',
    message: `The down payment${m?.amount ? ` of ${m.amount}` : ''} for${m?.property_name ? ` ${m.property_name}` : ' your property'} has been placed in escrow.`,
  }),

  escrow_released: (m) => ({
    title: 'Escrow funds released',
    message: `Escrow funds${m?.amount ? ` of ${m.amount}` : ''} for${m?.property_name ? ` ${m.property_name}` : ' your property'} have been released to your account.`,
  }),

  property_acquired: (m) => ({
    title: 'Property transfer complete',
    message: `${m?.property_name ?? 'Your property'} has been successfully transferred. The transaction is now complete.`,
  }),
};


export function buildNotificationPayload(
  type: NotificationType,
  base: Omit<CreateNotificationPayload, 'title' | 'message'>,
): CreateNotificationPayload {

  const content = NOTIFICATION_CONTENT[type](
    base.metadata as Record<string, string> | undefined
  );
  
  return { ...base, type, ...content };
}