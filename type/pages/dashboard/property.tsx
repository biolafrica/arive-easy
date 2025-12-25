export type MortgageStatus = | 'active' | 'closed' | 'pending' | 'arrears' | 'suspended';

export interface MortgageCardProps {
  title: string;
  address: string;
  status: MortgageStatus;
  propertyValue: string;
  loanBalance: string;
  interestRate: string;
  monthlyPayment: string;
  progressPercent: number;
  paidAmount: string;
  remainingAmount: string;
  nextPaymentDue?: string;
  mortgageEndDate: string;
  onMakePayment?: () => void;
}

export interface MortgageStatProps{
  label: string;
  value: string;
  highlight?: boolean;
}