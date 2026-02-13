import { UserBase } from "@/type/user";

export interface Address {
  street: string;
  street2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

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
  address?: Address;
};

export type PersonalInfoFormValues = Omit<PersonalInfoType, 'address'> & Address;

export interface EmploymentInfoType {
  employment_status:string;
  employer_name?:string;
  job_title?:string;
  current_job_years?:string;
  employment_type?:string;
  gross_income:string;
  other_income?:string;
  income_frequency:string;
  business_type?:string;
  incorporation_years?:string;
};

export interface PropertyPreferenceType {
  property_type:string;
  property_value:string;
  down_payment_amount:string;
  preffered_loan_term:string;
  other_loan_amount?:string;
  existing_mortgage?:string;
}

export const personalInfoInitialValues:PersonalInfoType= {
  first_name:"",
  last_name:"",
  email:"",
  phone_number:"",
  date_of_birth:"",
  residence_country:"",
  marital_status:"",
  dependant:"",
  visa_status: "",
  address: {
    street: "",
    street2: "",
    city: "",
    state: "",
    postal_code: "",
    country: ""
  }
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

export interface PreApprovalBase{
  id:string;
  reference_number:string;
  user_id:string;
  user_name:string;
  users?:UserBase;
  current_step: number;
  completed_steps:number;
  is_complete:boolean;
  personal_info:PersonalInfoType;
  employment_info:EmploymentInfoType;
  property_info:PropertyPreferenceType;
  document_info:DocumentInfoTypes;
  documents_uploaded:boolean;
  documents_id:string;

  status:string;
  conditions?:string[];
  rejection_reasons?:string[];
  guidance_notes?:string;
  reviewed_by:string;
  reviewed_at:string;

  created_at:string;
  updated_at:string
  recommended_monthly_payment:string;
  max_loan_amount:number;
  affordability_score:string;
  debt_to_income_ration:string;
}
export type PreAprovalStatus = Pick<PreApprovalBase, 'updated_at' | 'reviewed_at' | 'reviewed_by'| 'status' | 'conditions' | 'rejection_reasons' | 'completed_steps' | 'is_complete' | 'current_step'>;

export type BackendPreApprovalForm = Omit<PreApprovalBase, 'id' | 'created_at' | 'updated_at'>;

export interface DocumentInfoTypes {
  pay_stubs: File | string | null;
  tax_returns: File | string | null;
  bank_statements: File | string | null;
  employment_verification: File | string | null;
};

export const documentInfoInitialValues:DocumentInfoTypes ={
  pay_stubs: '',
  tax_returns: '',
  bank_statements: '',
  employment_verification: '',
}