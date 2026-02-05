
export type MortgageStatus = 
  | 'pending_payment_method'
  | 'active'
  | 'paused'
  | 'payment_failed'
  | 'completed'
  | 'cancelled';

export type PaymentMethodType = 
  | 'us_bank_account'
  | 'acss_debit'
  | 'card';

export interface Mortgage {
  id: string;
  application_id: string;
  user_id: string;
  
  // Loan Details
  property_price: number;
  down_payment_made: number;
  approved_loan_amount: number;
  interest_rate_annual: number;
  loan_term_months: number;
  
  // Payment Schedule
  monthly_payment: number;
  total_payments: number;
  first_payment_date: string;
  last_payment_date: string;
  payment_day_of_month: number;
  
  // Stripe References
  stripe_customer_id: string;
  stripe_setup_intent_id?: string;
  stripe_subscription_id?: string;
  stripe_payment_method_id?: string;
  stripe_price_id?: string;
  
  // Payment Method Details
  payment_method_type?: string;
  payment_method_display?: string;
  
  // Tracking
  payments_made: number;
  next_payment_date?: string;
  last_payment_date_actual?: string;
  
  // Status
  status: string;
  activated_at?: string;
  paused_at?: string;
  cancelled_at?: string;
  completed_at?: string;
  
  created_at: string;
  updated_at: string;
}



export type PaymentStatus = 
  | 'scheduled'
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface MortgagePayment {
  id: string;
  mortgage_id: string;
  application_id: string;
  
  // Payment Details
  payment_number: number;
  amount: number;
  due_date: string;
  
  // Stripe References
  stripe_subscription_id?: string;
  stripe_invoice_id?: string;
  stripe_payment_intent_id?: string;
  
  // Status
  status: PaymentStatus;
  paid_at?: string;
  failure_reason?: string;
  retry_count: number;
  
  created_at: string;
  updated_at: string;
}



export type DirectDebitStatus = 
  | 'not_started'
  | 'pending_setup'
  | 'active'
  | 'paused'
  | 'cancelled';

export interface DirectDebitSetupRequest {
  application_id: string;
  user_country: string;
}

export interface DirectDebitSetupResponse {
  client_secret: string;
  setup_intent_id: string;
  mortgage_id: string;
  customer_id: string;
}

export interface DirectDebitConfirmRequest {
  application_id: string;
  setup_intent_id: string;
  payment_method_id: string;
}

export interface DirectDebitConfirmResponse {
  success: boolean;
  subscription_id: string;
  mortgage_id: string;
  status: MortgageStatus;
}



export interface ApplicationDirectDebitFields {
  // Bank Terms (received from bank after underwriting)
  approved_loan_amount?: number;
  interest_rate_annual?: number;
  loan_term_months?: number;
  monthly_payment?: number;
  total_payments?: number;
  first_payment_date?: string;
  last_payment_date?: string;
  payment_day_of_month?: number;
  
  // Direct Debit Status
  direct_debit_status: DirectDebitStatus;
}


export interface MortgageWithPayments extends Mortgage {
  mortgage_payments?: MortgagePayment[];
  application?: {
    application_number: string;
    property_id: string;
  };
}

export interface PaymentScheduleResponse {
  mortgage: Mortgage;
  payments: MortgagePayment[];
  summary: {
    total_paid: number;
    total_remaining: number;
    next_payment_date: string | null;
    payments_completed: number;
    payments_remaining: number;
  };
}



export interface UpdatePaymentMethodForm {
  application_id: string;
  // The actual payment method is handled by Stripe Elements
}

export interface PausePaymentsForm {
  mortgage_id: string;
  reason?: string;
  resume_date?: string;
}


export interface StripeWebhookPayload {
  type: string;
  data: {
    object: Record<string, any>;
  };
}

export interface PaymentWebhookData {
  mortgage_id: string;
  payment_number: number;
  amount: number;
  status: PaymentStatus;
  stripe_invoice_id: string;
  stripe_payment_intent_id: string;
}