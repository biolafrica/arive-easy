export interface IdentityBase{
  id:string;
  user_id:string;
  application_id:string;
  plaid_identity_verification_id:string;
  plaid_link_session_id:string;
  status:string;
  verification_type:string;
  steps_completed:string;
  documents_provided:string;
  selfie_check:string;
  risk_check:string;
  redacted_data:string;
  webhook_data:string;
  created_at:string;
  updated_at:string;
}