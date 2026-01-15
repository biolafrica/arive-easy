import { StatusConfig, TableColumn } from "@/components/common/DataTable";
import { formatDate } from "@/lib/formatter";
import { FormField } from "@/type/form";
import { MockPreApprovals, PreApprovalBase } from "@/type/pages/dashboard/approval";


export const personalInfoFields:FormField[] = [
  { name:'first_name', label:'First Name', type:'text', required:true, placeholder:'Enter first name', helperText:'AS IT APPEARS ON YOUR ID' },
  { name:'last_name', label: 'Last Name', type:'text', placeholder:'Enter last name', required:true, helperText:'AS IT APPEARS ON YOUR ID'},
  { name: 'email', label: 'Email Address', type: 'email', placeholder: "Email", required: false, disabled: true},
  { name: 'phone_number', label: 'Phone Number', type: 'text', placeholder: 'Enter phone number', required: true },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'date', placeholder: 'Select date', required: true },
  { name: 'street', label: 'Street', type: 'text', placeholder: 'Enter street', required: true },
  { name: 'street2', label: 'Street 2', type: 'text', placeholder: 'Enter street', required: false },
  { name: 'city', label: 'City', type: 'text', placeholder: 'Enter city', required: true },
  { name: 'state', label: 'State', type: 'text', placeholder: 'Enter state/province', required: true },
  { name: 'zip_postal_code', label: 'Zip/Postal Code', type: 'text', placeholder: 'Enter zip/postal code', required: true },
  { name: 'residence_country', label: 'Country', type: 'select', required: true,
    options: [
      { label: 'Select country', value: '' },
      { label: 'United State', value: 'united_state' },
      { label: 'Canada', value: 'canada' },
    ],
  },

  { name: 'visa_status', label: 'Visa Status', type: 'select', required: true,
    options: [
      { label: 'Select visa type', value: '' },
      { label: 'Permanent Residence', value: 'permanent_residence'},
      { label: 'Student Visa', value: 'student_visa'},
      { label: 'Work Permit', value: 'work_permit'},
      { label: 'Citizen', value: 'citizen'},
      { label: 'Others', value: 'others'},

    ],
  },

  { name: 'marital_status', label: 'Marital Status', type: 'select', required: true,
    options: [
      { label: 'Select status', value: '' },
      { label: 'Single', value: 'single' },
      { label: 'Married', value: 'married' },
    ],
  },

  { name: 'dependant', label: 'Number of Financial Dependant', type: 'text', placeholder: 'Enter dependant number', required: true },

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

  { name: 'gross_income', label: 'Gross Income Amount($)', type: 'text', placeholder: 'Enter amount', required: true },
  { name: 'other_income', label: 'Other income Amount($)', type: 'text', placeholder: 'Enter amount', required: false },

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

  { name: 'property_value', label: 'Property Value', type: 'select', required: true,
    options: [
      { label: 'Select property value', value: '' },
      { value: '10000-30000', label: '$10,000-$30,000' },
      { value: '30000-50000', label: '$30,000-$50,000' },
      { value: '50000-80000', label: '$50,000-$80,000'},
      { value: '80000-100000', label: '$80,000-$100,000'},
      { value: '100000+', label: '$100,000+'},
    ],
  },

  { name: 'down_payment_amount', label: 'Down Payment Amount($)', type: 'text', placeholder: 'Enter amount', required: true, helperText:'MINIMUM 20% OF PROPERTY VALUE' },

    { name: 'preffered_loan_term', label: 'Preffered Loan Term', type: 'select', required: true,
    options: [
      { label: 'Select loan term', value: '' },
      { value: '0-5', label: '0-5 years' },
      { value: '6-10', label: '6-10 years' },
      { value: '11-30', label: '11-30 years'},
      { value: '31-50', label: '31-50 years'},
      { value: '50+', label: '50 years+'},
    ],
  },

  { name: 'other_loan_amount', label: 'Other Loan Amount($)', type: 'text', placeholder: 'Enter amount', required: false, helperText:'IF YOU HAVE AN OUTSATNDING LOAN' },

  { name: 'existing_mortgage', label: 'Existing Mortgage Amount($)', type: 'text', placeholder: 'Enter amount', required: false, helperText:'IF YOU HAVE AN OUTSTANDING MORTGAGE' },

]

export const DocumentInfoFields:FormField[] = [
  { name: 'pay_stubs', label: 'Pay Stubs(Last 12 months)', type: 'image', required: true, accept:'image/jpeg,image/png', aspectRatio: '16:9'},

  { name: 'tax_returns', label: 'Tax Returns(Last 12 months)', type: 'image', required: true, accept:'image/jpeg,image/png', aspectRatio: '16:9' },

  { name: 'bank_statements', label: 'Bank Statement(Last 12 months)', type: 'image', required: true, accept:'image/jpeg,image/png', aspectRatio: '16:9'},

  { name: 'employment_verification', label: 'Employment Verification', type: 'image', required: true, accept:'image/jpeg,image/png', aspectRatio: '16:9'},
]

export const getEmploymentInfoFields = (employmentStatus: string): FormField[] => {

  const baseFields: FormField[] = [
    { name: 'employment_status', label: 'Employment Status', type: 'select', required: true,
      options: [
        { label: 'Select status', value: '' },
        { label: 'Employed', value: 'employed' },
        { label: 'Self-employed', value: 'self_employed' },
        { label: 'Business Owner', value: 'business_owner'},
      ],
    },
  ];

  if (!employmentStatus) {
    return baseFields;
  }

  if (employmentStatus === 'business_owner') {
    return [
      ...baseFields,
      { name: 'business_type', label: 'Business Type', type: 'text',  placeholder: 'Enter type of business', required: true },
      { name: 'incorporation_years', label: 'Years of Incorporation', type: 'text', placeholder: 'Enter year incorporated', required: true},
      { name: 'gross_income', label: 'Gross Business Income Amount($)', type: 'text', placeholder: 'Enter amount', required: true },
      { name: 'other_income', label: 'Other income Amount($)', type: 'text', placeholder: 'Enter amount', required: false },
      { name: 'income_frequency', label: 'Frequency of Income', type: 'select', required: true,
        options: [
          { label: 'Select frequency', value: '' },
          { label: 'Monthly', value: 'monthly' },
          { label: 'Quarterly', value: 'quarterly' },
          { label: 'Annually', value: 'annually' },
        ],
      },
    ];
  }


  return [
    ...baseFields,
    { name: 'employer_name', label: employmentStatus === 'self_employed' ? 'Business/Client Name' : 'Employer Name', 
      type: 'text', required: true,  placeholder: employmentStatus === 'self_employed' ? 'Enter business or primary client name' : 'Enter employer name'},
    { name: 'job_title', label: 'Job Title/Role', type: 'text', placeholder: 'Enter job title', required: true },
    { name: 'current_job_years', label: 'Years at Current Position', type: 'text', placeholder: 'Enter years', required: true },
    { name: 'employment_type', label: 'Employment Type', type: 'select', required: true,
      options: [
        { label: 'Select type', value: '' },
        { label: 'Permanent', value: 'permanent' },
        { label: 'Contract', value: 'contract' },
        { label: 'Temporary', value: 'temporary' },
      ],
    },
    { name: 'gross_income', label: 'Gross Income Amount($)', type: 'text', placeholder: 'Enter amount', required: true },
    { name: 'other_income', label: 'Other income Amount($)', type: 'text', placeholder: 'Enter amount', required: false },
    { name: 'income_frequency', label: 'Frequency of Income', type: 'select', required: true,
      options: [
        { label: 'Select frequency', value: '' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Bi-Weekly', value: 'bi-weekly' },
      ],
    },
  ];
};

export const columns: TableColumn<PreApprovalBase>[] = [
  { key: 'reference_number', header: 'Approval ID', sortable: false},
  { key: 'user', header: 'User', sortable: false, accessor: (row) => row.users?.name || ''},
  { key: 'current_step', header: 'Current stage', sortable: false,},
  { key: 'created_at', header: 'Date Created', sortable: false, accessor: (row) => formatDate(row.created_at)},
];

export const statusConfig: StatusConfig[] = [
  { value: 'approved', label: 'Approved', variant: 'green' },
  { value: 'pending', label: 'Submitted', variant: 'yellow' },
  { value: 'rejected', label: 'Rejected', variant: 'red' },
  { value: 'draft', label: 'Draft', variant: 'blue' },
];

export const MOCK_DATA: MockPreApprovals[] = [
  {id: "PA-1001",
    user_id: "U-2001",
    users:{
      name:"John Doe",
      email:"john@gmail.com"
    },
    current_step: 4,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-16T12:00:00Z",
    status: "submitted",
  },
  {
    id: "PA-1002",
    user_id: "U-2002",
    users:{
      name:"Jane Smith",
      email:"jane@gmail.com"
    },
    current_step: 4,
    created_at: "2024-02-20T14:45:00Z",
    updated_at: "2024-02-21T09:15:00Z",
    status: "approved",
  }
]

export function usePreApprovals(queryParams?: Record<string, any>) {
  return {
    pre_approvals:MOCK_DATA,
    isLoading: false,
  }
}
