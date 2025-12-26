import { FormField } from "@/type/form";

export const personalInfoFields:FormField[] = [
  { name:'first_name', label:'First Name', type:'text', required:true, placeholder:'Enter first name', helperText:'AS IT APPEARS ON YOUR ID' },
  { name:'last_name', label: 'Last Name', type:'text', placeholder:'Enter last name', required:true, helperText:'AS IT APPEARS ON YOUR ID'},
  { name: 'email', label: 'Email Address', type: 'email', placeholder: "Email", required: true , },
  { name: 'phone_number', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number', required: false },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'date', placeholder: 'Select date', required: true },
  { name: 'residence_country', label: 'Country of Residence', type: 'select', required: false,
    options: [
      { label: 'Select country', value: '' },
      { label: 'United State', value: 'united_state' },
      { label: 'Canada', value: 'canada' },
    ],
  },
  { name: 'marital_status', label: 'Marital Status', type: 'select', required: false,
    options: [
      { label: 'Select status', value: '' },
      { label: 'Single', value: 'single' },
      { label: 'Married', value: 'married' },
    ],
  },
  { name: 'dependant', label: 'Number of Financial Dependant', type: 'number', placeholder: 'Enter dependant number', required: false },

]

export const employmentInfoFields:FormField[] = [
  { name: 'employment_status', label: 'Employment Status', type: 'select', required: true,
    options: [
      { label: 'Select status', value: '' },
      { label: 'Employed', value: 'employed' },
      { label: 'Self-employed', value: 'self_employed' },
      { label: 'Business Owner', value: 'business_owner'},
    ],
  },
  { name: 'employer_name', label: 'Employer Name', type: 'text', required: true, placeholder:'Enter employer name'},
  { name: 'job_title', label: 'Job Title', type: 'text', placeholder: 'Enter job title', required: true},
  { name: 'current_job_years', label: 'Years at Current Job', type: 'text', placeholder: 'Enter years', required: false },
  { name: 'employment_type', label: 'Employment Type', type: 'select', required: true,
    options: [
      { label: 'Select type', value: '' },
      { label: 'Permanent', value: 'permanent' },
      { label: 'Contract', value: 'contract' },
      { label: 'Temporary', value: 'temporary' },
    ],
  },

  { name: 'gross_income', label: 'Gross Income Amount', type: 'text', placeholder: 'Enter amount', required: true },
  { name: 'other_income', label: 'Other income Amount', type: 'text', placeholder: 'Enter amount', required: false },

  { name: 'frequency_of_income', label: 'Frequency of Income', type: 'select', required: true,
    options: [
      { label: 'Select frequency', value: '' },
      { label: 'Monthly', value: 'monthly' },
      { label: 'Weekly', value: 'weekly' },
      { label: 'Bi-Weekly', value: 'bi-weekly' },
    ],
  },

  { name: 'business_type', label: 'Business Type', type: 'text', placeholder: 'Enter type of business', required: false, helperText:"BUSINESS OWNER ONLY" },
  { name: 'incorporation_years', label: 'Years of Incorporation', type: 'text', placeholder: 'Enter year incorporated', required: false, helperText:"BUSINESS OWNER ONLY" },

]

export const propertyPreferenceFields:FormField[] = [
  { name: 'property_type', label: 'Property Type', type: 'select', required: true,
    options: [
      { label: 'Select property type', value: '' },
      { label: 'Apartment', value: 'apartment' },
      { label: 'Detached House', value: 'detached_house' },
      { label: 'Semi Detached', value: 'semi_detached'},
      { label: 'Terrace', value: 'terrace'},
      { label: 'Land', value: 'land'},
    ],
  },
  { name: 'estimated_property_value', label: 'Estimated Property Value', type: 'text', required: true, placeholder:'Enter amount' },
  { name: 'down_payment_amount', label: 'Down Payment Amount', type: 'text', placeholder: 'Enter amount', required: true},
  { name: 'preffered_loan_term', label: 'Preffered Loan Term', type: 'text', placeholder: 'Enter amount', required: true },
  { name: 'other_loan_amount', label: 'Other Loan Amount', type: 'text', placeholder: 'Enter amount', required: false, helperText:'IF YOU HAVE AN OUTSATNDING LOAN' },
  { name: 'existing_mortgage', label: 'Existing Mortgage Amount', type: 'text', placeholder: 'Enter amount', required: false, helperText:'IF YOU HAVE AN OUTSTANDING MORTGAGE' },

]

export const DocumentUploadFields:FormField[] = [
  { name: 'identity_proof', label: 'Proof of Identity', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3', helperText: 'BIO DATA PAGE ONLY' },
  { name: 'income_proof_1', label: 'Month 1 Income (Most Recent)', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3' },
  { name: 'income_proof_2', label: 'Month 2 Income', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3'},
  { name: 'income_proof_3', label: 'Month 3 Income ', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3'},
  { name: 'bank_statement_1', label: 'Month 1 Bank Statement(Most Recent)', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3'},
  { name: 'bank_statement_2', label: 'Month 2 Income Bank Statement', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3'},
  { name: 'bank_statement_3', label: 'Month 3 Income Bank Statement', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3'},
  { name: 'other_document', label: 'Other Document', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3', helperText: "ANY DOCUMENT YOU THINK MIGHT BE IMPORTANT"},
 

]

