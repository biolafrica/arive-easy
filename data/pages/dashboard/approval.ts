import { FormField } from "@/type/form";

export const personalInfoFields:FormField[] = [
  { name:'first_name', label:'First Name', type:'text', required:true, placeholder:'Enter first name', helperText:'AS IT APPEARS ON YOUR ID' },
  { name:'last_name', label: 'Last Name', type:'text', placeholder:'Enter last name', required:true, helperText:'AS IT APPEARS ON YOUR ID'},
  { name: 'email', label: 'Email Address', type: 'email', placeholder: "Email", required: true , },
  { name: 'phone_number', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number', required: true },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'date', placeholder: 'Select date', required: true },
  { name: 'residence_country', label: 'Country of Residence', type: 'select', required: false,
    options: [
      { label: 'Select country', value: '' },
      { label: 'United State', value: 'united_state' },
      { label: 'Canada', value: 'canada' },
    ],
  },
  { name: 'visa_status', label: 'Visa Status', type: 'text', placeholder: 'Enter Status', required: true },
  { name: 'marital_status', label: 'Marital Status', type: 'select', required: true,
    options: [
      { label: 'Select status', value: '' },
      { label: 'Single', value: 'single' },
      { label: 'Married', value: 'married' },
    ],
  },
  { name: 'dependant', label: 'Number of Financial Dependant', type: 'number', placeholder: 'Enter dependant number', required: true },

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

  { name: 'income_frequency', label: 'Frequency of Income', type: 'select', required: true,
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
  { name: 'property_value', label: 'Estimated Property Value', type: 'text', required: true, placeholder:'Enter amount' },
  { name: 'down_payment_amount', label: 'Down Payment Amount', type: 'text', placeholder: 'Enter amount', required: true},
  { name: 'preffered_loan_term', label: 'Preffered Loan Term', type: 'text', placeholder: 'Enter amount', required: true },
  { name: 'other_loan_amount', label: 'Other Loan Amount', type: 'text', placeholder: 'Enter amount', required: false, helperText:'IF YOU HAVE AN OUTSATNDING LOAN' },
  { name: 'existing_mortgage', label: 'Existing Mortgage Amount', type: 'text', placeholder: 'Enter amount', required: false, helperText:'IF YOU HAVE AN OUTSTANDING MORTGAGE' },

]

export const DocumentUploadFields:FormField[] = [
  { name: 'identity_type', label: 'Identity Type', type: 'text', placeholder: 'Enter identity type', required: true },
  { name: 'identity_proof', label: 'Proof of Identity', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3', helperText: 'BIO DATA PAGE ONLY' },

  { name: 'payslip_start_date', label: 'Payslip Start Date', type: 'date', placeholder: 'Select start date', required: true },
  { name: 'payslip_end_date', label: 'Payslip End Date', type: 'date', placeholder: 'Select end date', required: true },
  { name: 'payslip_image', label: 'Payslip Image', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3', helperText:"UPLOAD 12 MONTHS PAYSLIP" },

  { name: 'bank_statement_start_date', label: 'Bank Statement Start Date', type: 'date', placeholder: 'Select start date', required: true },
  { name: 'bank_statement_end_date', label: 'Bank Statement End Date', type: 'date', placeholder: 'Select end date', required: true },
  { name: 'bank_statement_image', label: 'Bank Statement Image', type: 'file', required: true, accept:'image/jpeg,image/png', aspectRatio: '4:3', helperText:"UPLOAD 12 MONTHS PAYSLIP"},

   { name: 'other_document_name', label: 'Other Document Name', type: 'text', placeholder: 'Enter other document name', required: false },
  { name: 'other_document_image', label: 'Other Document', type: 'file', required: false, accept:'image/jpeg,image/png', aspectRatio: '4:3', helperText: "ANY DOCUMENT YOU THINK MIGHT BE IMPORTANT"},
 
]

