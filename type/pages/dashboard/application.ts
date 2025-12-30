import { PropertyBase } from "../property";
import { PreApprovalBase } from "./approval";

export type ApplicationStageStatus = | 'completed' | 'current' | 'upcoming' | 'rejected';

export interface ApplicationStage {
  step: number;
  key: string;
  title: string;
  status: ApplicationStageStatus;

  completedAt?: string; 
  errorMessage?: string; 
}

export type CurrentStage = | "property_selection" | "identity_verification" | "document_submission" | "seller_review" | "bank_underwriting" | "terms_agreement" | "payment_setup" | "down_payment" | "active" ;

export type Status = | "draft" | "in_progress" | "pending_approval" | "approved" | "active" | "completed" | "cancelled" | "rejected";

export type KYCStatus = | "pending" | "in_progress" | "verified" | "failed" ;
export type DeveloperStatus = | "pending" | "reviewing" | "approved" | "rejected" ;
export type UnderwritingStatus = | "pending" | "document_review" | "risk_assessment" | "approved" | "conditional" | "rejected" ;

export interface PropertySelection{
  completed : string;
  completed_at: string;
}

export type IdentityVerification = PropertySelection
export type DocumentSubmission = PropertySelection

export interface  ApplicationBase{
  id: string;
  application_number: string;

  pre_approval_id: string;
  pre_approvals:PreApprovalBase;

  property_id: string;
  properties:PropertyBase;

  user_id: string;
  developer_id: string;
  bank_name: string;

  current_stage: string
  status: string;
  stages_completed :{
    property_selection:PropertySelection
    identity_verification:IdentityVerification
    document_submission:DocumentSubmission
  };

  kyc_status: string;
  kyc_provider:string;
  kyc_session_id: string;
  kyc_result:string;
  kyc_verified_at: string;
  kyc_retry_count: number

  property_price: number;
  loan_amount: number;
  approved_loan_amount: number;
  down_payment_amount: number;
  down_payment_percentage: number;
  interest_rate: number;
  loan_term_months: number;
  monthly_payment:number;

  processing_fee:number;
  valuation_fee:number;
  legal_fee:number;
  total_fee:number;

  developer_status: string;
  developer_reviewed_at:string;
  developer_reviewed_by:string;
  developer_notes:string;

  underwriting_status:string;
  underwriting_started_at:string;
  underwriting_completed_at:string;
  underwriter_id:string;
  underwriting_notes:string;
  risk_score:string;

  terms_sent_at:string;
  terms_accepted_at:string;
  contract_document_url:string;
  contract_signed_at:string;

  payment_method:string;
  stripe_customer_id :string;
  stripe_payment_method_id:string;
  bank_account_details:string;

  created_at: string;
  updated_at:string;

}

