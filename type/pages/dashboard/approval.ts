export interface PersonalInfoType {
  first_name:string;
  last_name:string;
  email:string;
  phone_number:string;
  date_of_birth:string;
  residence_country:string;
  marital_status:string;
  dependant:string;
  visa_status:string;
};

export interface EmploymentInfoType {
  employment_status:string;
  employer_name:string;
  job_title:string;
  current_job_years:string;
  employment_type:string;
  gross_income:string;
  other_income:string;
  income_frequency:string;
  business_type:string;
  incorporation_years:string;
};

export interface PropertyPreferenceType {
  property_type:string;
  property_value:string;
  down_payment_amount:string;
  preffered_loan_term:string;
  other_loan_amount:string;
  existing_mortgage:string;
};

export const personalInfoInitialValues:PersonalInfoType= {
  first_name:"",
  last_name:"",
  email:"",
  phone_number:"",
  date_of_birth:"",
  residence_country:"",
  marital_status:"",
  dependant:"",
  visa_status: ""
};

export const employmentInfoInitialValues:EmploymentInfoType= {
  employment_status:"",
  employer_name:"",
  job_title:"",
  current_job_years:"",
  employment_type:"",
  gross_income:"",
  other_income:"",
  income_frequency:"",
  business_type:"",
  incorporation_years:""

};

export const propertyPreferenceInitialValues:PropertyPreferenceType ={
  property_type:"",
  property_value:"",
  down_payment_amount:"",
  preffered_loan_term:"",
  other_loan_amount:"",
  existing_mortgage:""
};

export const documentUploadInitialValues:DocumentUploadType ={
  identity_proof:"",
  identity_type:"",
  payslip_start_date:"",
  payslip_end_date:"",
  payslip_image:"",
  bank_statement_start_date:"",
  bank_statement_end_date:"",
  bank_statement_image:"",
  other_document_name:"",
  other_document_image:""

}


export interface PreApprovalBase{
  id:string;
  reference_number:string;
  user_id:string;
  current_step: number;
  completed_steps:number;
  is_complete:boolean;
  personal_info:PersonalInfoType;
  employment_info:EmploymentInfoType;
  property_info:PropertyPreferenceType;
  documents_uploaded:boolean;
  documents_id:string;
  status:string;
  conditions:string;
  rejection_reasons:string;
  guidance_notes:string;
  reviewed_by:string;
  reviewed_at:string;
  created_at:string;
  updated_at:string
}

export interface PreApprovalDocumentBase {
  id:string;
  pre_approval_id:string;
  user_id:string;
  status:string;
  identity_type:string;
  identity_proof: File | string | null;
  payslip_start_date:string;
  payslip_end_date:string;
  payslip_image: File | string | null;
  bank_statement_start_date:string;
  bank_statement_end_date:string;
  bank_statement_image: File | string | null;
  other_document_name:string;
  other_document_image: File | string | null;
  created_at:string;
  updated_at:string;
};

export type DocumentUploadType = Omit<PreApprovalDocumentBase, 'id' | 'pre_approval_id' | 'user_id' | 'status' |'created_at' | 'updated_at'>

export type BackendPreApprovalForm = Omit<PreApprovalBase, 'id' | 'created_at' | 'updated_at'>