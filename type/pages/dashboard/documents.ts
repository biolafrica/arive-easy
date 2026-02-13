
interface Signature{
  buyer:boolean;
  seller:boolean;
  banker:boolean;
}

interface SignatureDetails{
  signed_at:string;
  ip_address:string;
  name:string;
}

interface TransactionSignature{
  buyer?: SignatureDetails;
  seller?: SignatureDetails;
  banker?: SignatureDetails;
}

export type TemplateType = 'contract_of_sales' | 'mortgage_agreement' | 'certificate_of_occupancy' | 'title_deed';
export type TemplateCategory = 'online_generated' | 'scanned_upload';
export type TransactionStatus = 'pending' |'generating' | 'sent' | 'viewed' |'partially_signed' | 'completed' | 'voided' | 'expired'


export interface TemplateBase {
  id: string;
  name: string;
  slug: string; 
  template_number: string;
  requires_signature: Signature;
  type: TemplateType;
  version: number;
  template_file_url: string; 
  template_fields : string[];
  status: 'active' | 'inactive';
  description?: string;
  replaced_by?: string; 
  parent_template_id?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface PartnerDocumentBase {
  id: string;
  partner_document_number :string;
  template_id :string
  partner_id :string


  template_version :string
  partner_type :string
  document_name :string
  document_description :string

  static_data :string
  custom_clauses :string
  custom_terms :string
  default_values :string

  status : 'draft' | 'active' | 'archived';
  
  last_generated_at: string | null;
  template_document_url: string | null;
  created_at: string;
  updated_at: string;
  activated_at: string | null;
}

export interface TransactionDocumentBase {
  id: string;
  partner_document_id :string
  transaction_document_number :string;
  application_id :string
  buyer_id :string

  populated_data :string[]
  generated_document_url :string
  esign_provider :string
  esign_document_id :string
  esign_envelope_id :string
  signing_url :string
  signatures :TransactionSignature;
  required_signatures :string[]
  audit_log :string[];  
  signed_document_url:string;  
  status:TransactionStatus

  generated_at :string;
  sent_at :string;
  viewed_at :string;
  completed_at :string;
  expires_at :string;
  created_at: string;
  updated_at: string;
}