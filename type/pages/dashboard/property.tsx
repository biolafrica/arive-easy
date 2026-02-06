import { MortgageForm } from "./mortgage";

export interface MortgageCardProps {
  mortgage: MortgageForm;
  onMakePayment?: (mortgageId: string) => void;
}

export type MortgageStatus = 'active' | 'pending_verification' | 'pending_payment_method' | 'payment_failed' | 'paused' | 'completed' | 'cancelled';