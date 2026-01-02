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

export type ApplicationStageKey = 
| "personal_info" 
| "employment_info" 
| "property_preferences" 
| "documents_upload" 
| "property_selection" 
| "identity_verification" 
| "terms_agreement" 
| "payment_setup" 
| "mortgage_activation" 

export type StageStatus = | "completed" | "current" | "upcoming" | "rejected" | "in_progress" ;

export interface StageMetadata {
  completed: boolean;
  completed_at?: string;
  status: StageStatus;
  error_message?: string;
  retry_count?: number;
  data?: any;
}
export interface VerificationStageMetadata {
  completed: boolean;
  completed_at?: string;
  status: KYCStatus;
  error_message?: string;
  retry_count?: number;
  data?: any;
}


export type KYCStatus = | "pending" | "success" | "expired" | "failed" | "canceled" ;
export type DeveloperStatus = | "pending" | "reviewing" | "approved" | "rejected" ;
export type UnderwritingStatus = | "pending" | "document_review" | "risk_assessment" | "approved" | "conditional" | "rejected" ;


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

  current_stage: ApplicationStageKey;
  current_step:number;
  status: string;
  stages_completed :{
    personal_info?: StageMetadata;
    employment_info?: StageMetadata;
    property_preferences?: StageMetadata;
    documents_upload?: StageMetadata;
    property_selection?: StageMetadata;
    identity_verification?: VerificationStageMetadata;
    terms_agreement?: StageMetadata;
    payment_setup?: StageMetadata;
    mortgage_activation?: StageMetadata;
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
  processing_fee_payment_status:string;
  processing_fee_payement_day:string;
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

  identity_verification_status:string;
  identity_verification_completed_at:string;
  
  mortgage_start_date:string;
  created_at: string;
  updated_at:string;

}

