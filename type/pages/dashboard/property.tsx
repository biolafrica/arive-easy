export type MortgageStatus = | 'active' | 'closed' | 'pending' | 'arrears' | 'suspended';
import { PropertyBase } from "@/type/pages/property";

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

export type MockPropertyBase = Pick<PropertyBase, 'id' | 'developer_id' | 'title' | 'status' |  'price' |  'is_active' |  'created_at' |  'updated_at' | 'property_type'> & {
  users: {
    name: string;
    email: string;
  }
};