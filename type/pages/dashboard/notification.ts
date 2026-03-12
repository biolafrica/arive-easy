
export type NotificationType =
  // Buyer
  | 'pre_approval_submitted'
  | 'pre_approval_accepted'
  | 'account_created'
  | 'pre_approval_rejected'
  | 'processing_fee_success'
  | 'processing_fee_failed'
  | 'kyc_approved'
  | 'kyc_rejected'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'down_payment_success'
  | 'down_payment_failed'
  | 'valuation_fee_success'
  | 'valuation_fee_failed'
  | 'legal_fee_success'
  | 'legal_fee_failed'
  | 'document_signed'
  | 'document_submitted'
  | 'mortgage_activated'
  | 'payment_reminder'
  | 'subscription_payment_success'
  | 'subscription_payment_failed'
  | 'terms_stage_completed'
  | 'payment_stage_completed'
  // Seller
  | 'offer_received'
  | 'down_payment_received'
  | 'account_setup'
  | 'escrow_released'
  | 'property_acquired';

export type NotificationChannel = 'in_app' | 'email' | 'both';
export type NotificationStatus = 'unread' | 'read';

export interface NotificationMetadata {
  amount?: string;           // e.g. "$1,200"
  currency?: string;
  property_name?: string;
  application_number?: string;
  reference_number?: string;
  cta_url?: string;    
  due_date?: string;
  [key: string]: unknown;
}

export interface NotificationBase {
  id: string;
  user_id: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  message: string;
  application_id?: string | null;
  pre_approval_id?: string | null;
  property_id?: string | null;
  payment_id?: string | null;
  offer_id?: string | null;
  metadata: NotificationMetadata;
  email_sent: boolean;
  email_sent_at?: string | null;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}



export type CreateNotificationPayload = Omit<NotificationBase, 'id' | 'status' | 'email_sent' | 'email_sent_at' | 'read_at' | 'created_at' | 'updated_at'>


