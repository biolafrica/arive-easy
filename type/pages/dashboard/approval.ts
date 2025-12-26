export interface PersonalInfoType {
  first_name:string;
  last_name:string;
  email:string;
  phone_number:string;
  date_of_birth:string;
  residence_country:string;
  marital_status:string;
  dependant:string;
};

export interface EmploymentInfoType {
  employment_status:string;
  employer_name:string;
  job_title:string;
  current_job_years:string;
  employment_type:string;
  gross_income:string;
  other_income:string;
  frequency_of_income:string;
  business_type:string;
  incorporation_years:string;
};

export interface PropertyPreferenceType {
  property_type:string;
  estimated_property_value:string;
  down_payment_amount:string;
  preffered_loan_amount:string;
  other_loan_amount:string;
  existing_mortgage:string;
};

export interface DocumentUploadType {
  identity_proof: File | string | null;
  income_proof_1: File | string | null;
  income_proof_2: File | string | null;
  income_proof_3: File | string | null;
  bank_statement_1: File | string | null;
  bank_statement_2: File | string | null;
  bank_statement_3: File | string | null;
  other_document: File | string | null;
};

export const personalInfoInitialValues:PersonalInfoType= {
  first_name:"",
  last_name:"",
  email:"",
  phone_number:"",
  date_of_birth:"",
  residence_country:"",
  marital_status:"",
  dependant:""
};

export const employmentInfoInitialValues:EmploymentInfoType= {
  employment_status:"",
  employer_name:"",
  job_title:"",
  current_job_years:"",
  employment_type:"",
  gross_income:"",
  other_income:"",
  frequency_of_income:"",
  business_type:"",
  incorporation_years:""

};

export const propertyPreferenceInitialValues:PropertyPreferenceType ={
  property_type:"",
  estimated_property_value:"",
  down_payment_amount:"",
  preffered_loan_amount:"",
  other_loan_amount:"",
  existing_mortgage:""
};

export const documentUploadInitialValues:DocumentUploadType ={
  identity_proof:"",
  income_proof_1:"",
  income_proof_2:"",
  income_proof_3:"",
  bank_statement_1:"",
  bank_statement_2:"",
  bank_statement_3:"",
  other_document:""

}