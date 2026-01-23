export type DiditVerificationStatus = |'not_started'|'in_progress'|'in_review'|'approved'|'declined'|'expired'|'abandoned'|'kyc_expired';

export type DiditOverallStatus =| 'not_started'| 'partial'| 'pending'| 'approved'| 'failed';

export type VerificationType = 'home_country' | 'immigration';

export interface VerificationBase{
  id:string;
  application_id:string;
  user_id:string;

  home_country_session_id?: string;
  home_country_status: DiditVerificationStatus;
  home_country_verified_at?: string;
  home_country_document_type?: string;
  home_country_document_number?: string;
  home_country_expiry_date?: string;
  home_country_kyc_data: DiditKYCData;
  
  immigration_session_id?: string;
  immigration_status: DiditVerificationStatus;
  immigration_verified_at?: string;
  immigration_document_type?: string;
  immigration_document_number?: string;
  immigration_country?: string;
  immigration_expiry_date?: string;
  immigration_kyc_data:DiditKYCData; 
  
  overall_status: DiditOverallStatus;
  updated_at: string;
  created_at:string;

}

export interface DiditSessionResponse {
  session_id: string;
  session_number: number;
  session_token: string;
  vendor_data: string;
  metadata?: Record<string, any>;
  status: string;
  workflow_id: string;
  callback: string;
  url: string;
}

export interface DiditWebhookPayload {
  session_id: string;
  status: string;
  vendor_data: string;
  workflow_id: string;
  webhook_type: 'status.updated' | 'data.updated';
  timestamp: string;
  created_at: string;
  metadata?: Record<string, any>;
  decision?: DiditDecision;
}

interface DiditDecision {
  session_id: string;
  status: string;
  vendor_data: string;
  workflow_id: string;
  callback: string;
  features: string[];
  id_verifications?: DiditIdVerification[];
  face_matches?: DiditFaceMatch[];
  liveness_checks?: DiditLivenessCheck[];
  ip_analyses?: DiditIpAnalysis[];
 
}

interface DiditIdVerification {
  status: string;
  document_type: string;
  document_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  expiration_date: string;
  date_of_issue: string;
  gender: string;
  nationality: string;
  issuing_state: string;
  issuing_state_name: string;
  place_of_birth?: string;
  portrait_image?: string;
  front_image?: string;
  age?: number;
  extra_fields?: Record<string, any>;
  warnings: any[];
}

interface DiditFaceMatch {
  status: string;
  score: number;
  source_image: string;
  target_image: string;
  warnings: any[];
}

interface DiditLivenessCheck {
  status: string;
  score: number;
  method: string;
  reference_image: string;
  age_estimation?: number;
  warnings: any[];
}

interface DiditIpAnalysis {
  status: string;
  ip_address: string;
  ip_country: string;
  ip_country_code: string;
  ip_city: string;
  is_vpn_or_tor: boolean;
  is_data_center: boolean;
  warnings: any[];
}


export interface DiditKYCData {
  id_verification?: {
    status: string;
    document_type: string;
    document_country: string;
    document_number: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    expiry_date?: string;
    gender?: string;
    nationality?: string;
    portrait_image?: string;
    warnings?: string[];
  };
  face_match?: {
    status: string;
    similarity_score: number;
    warnings?: string[];
  };
  liveness?: {
    status: string;
    warnings?: string[];
  };
  aml_screening?: {
    status: string;
    match_status: 'clear' | 'potential_match' | 'match';
    warnings?: string[];
  };
}


export type IdentityVerificationData = Omit<VerificationBase, 'application_id' | 'user_id' | 'created_at' | 'immigration_kyc_data' |'home_country_kyc_data' |' overall_status' | 'id'>

export interface CreateSessionRequest {
  application_id: string;
  verification_type: VerificationType;
}

export interface CreateSessionResponse {
  success: boolean;
  url?: string;
  session_id?: string;
  error?: string;
}

export interface CheckStatusResponse {
  success: boolean;
  home_country_status: DiditVerificationStatus;
  immigration_status: DiditVerificationStatus;
  overall_status: string;
  error?: string;
}

// Props for components
export interface VerificationClientViewProps {
  hasPaid: boolean;
  application_id: string;
  verificationData?: IdentityVerificationData;
  onStatusUpdate?: () => void;
}

export interface VerificationCardProps {
  title: string;
  description: string;
  status: DiditVerificationStatus;
  onVerify: () => void;
  disabled: boolean;
  isLoading: boolean;
  documentInfo?: {
    type?: string;
    number?: string;
    expiryDate?: string;
  };
}

