import { StatusConfig, TableColumn } from "@/components/table/DataTable";
import { formatDate} from "@/lib/formatter";
import { FormField } from "@/type/form";
import { AddLegalForm, AddPlan, AddTermsForm, AddValuationForm, ApplicationBase, ApplicationStage} from "@/type/pages/dashboard/application";
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";
import * as icon  from '@heroicons/react/24/outline';


export const APPLICATION_STAGES: ApplicationStage[] = [
  {
    step: 1,
    key: 'personal_details',
    title: 'Personal Details',
    status: 'completed',
    completedAt: '2025-01-04',
  },
  {
    step: 2,
    key: 'employment_income',
    title: 'Employment & Income',
    status: 'rejected',
    errorMessage:
      'We need additional income verification documents to proceed.',
  },
  {
    step: 3,
    key: 'property_details',
    title: 'Property Details',
    status: 'current',
  },
  {
    step: 4,
    key: 'documents',
    title: 'Document Uploads',
    status: 'upcoming',
  },
];

export const columns: TableColumn<ApplicationBase>[] = [
  { key: 'application_number', header: 'Approval ID', sortable: false},
  { key: 'property_name', header: 'Property', sortable: false},
  { key: 'current_stage', header: 'Current stage', sortable: false, accessor: (row) => humanizeSnakeCase(row.current_stage)},

  { key: 'created_at', header: 'Date Created', sortable: false, accessor: (row) => formatDate(row.created_at)},
];

export const statusConfig: StatusConfig[] = [
  { value: 'in_progress', label: 'Pending', variant: 'yellow' },
  { value: 'rejected', label: 'Rejected', variant: 'red' },
  { value: 'active', label: 'Completed', variant: 'green' },
];

export const downPaymentField:FormField[]=[
  {name: 'down_payment', label:"Down Payment($)", type:'money', required:true , placeholder:"Enter Amount", currency:"USD", locale:"en-US", showCurrencySymbol:true}
]

export interface DownPaymentForm{
  down_payment:string
}

export const downPaymentInitialValue:DownPaymentForm ={
  down_payment:''
}

export const valuationField:FormField[]=[
  {name:'valuation_fee', label:"Valuation Fee Amount($)", type:'money', required:true, placeholder:"Enter Amount", currency:"USD", locale:"en-US", showCurrencySymbol:true},
]

export const planField:FormField[]=[
  {name:'monthly_payment', label:"Monthly Payment($)", type:'money', required:true, placeholder:"Enter Amount", currency:"USD", locale:"en-US", showCurrencySymbol:true},

  {name:'first_payment_date', label:"First Payment Date", type:"date", required:true,},
  {name:'last_payment_date', label:"Last Payment Date", type:"date", required:true},

  {name:'total_payment', label:"Total Payment($)", type:"money", required:true, placeholder:"Enter Amount", currency:"USD", locale:"en-US", showCurrencySymbol:true},

  {name:'loan_term_months', label:"Loan Term Months", type:"text", required:true, placeholder:"Enter term months"},
  
  {name:'payment_day_of_month', label:"Payment Day", type:"text", required:true, placeholder:"Enter payment day"},

]

export const legalField:FormField[]=[
  {name:'legal_fee', label:"Legal Fee Amount($)", type:'money', required:true, placeholder:"Enter Amount",currency:"USD", locale:"en-US", showCurrencySymbol:true},
]

export const termField:FormField[]=[
  {name:'loan_term_months', label:"Term Months", type:'text', required:true, placeholder:"Enter months"},
  {name:'interest_rate', label:"Interest Rate(%)", type:'text', required:true, placeholder:"Enter interest percentage"},
  {name:'down_payment_percentage', label:"Down Payment (%)", type:'text', required:true, placeholder:"Enter percentage"},
  {name:'approved_loan_amount', label:"Approved Loan Amount($)", type:'money', required:true, placeholder:"Enter amount",currency:"USD", locale:"en-US", showCurrencySymbol:true},
]

export const valuationInitialValue:AddValuationForm = {
  valuation_fee:0
}


export const legalInitialValue:AddLegalForm = {
  legal_fee:0
}

export const termInitialValue:AddTermsForm = {
  loan_term_months:0,
  interest_rate:0,
  down_payment_percentage:0,
  approved_loan_amount:0
}

export const planInitialValue:AddPlan={
  last_payment_date:"",
  first_payment_date:"",
  monthly_payment:0,
  total_payment:0,
  loan_term_months:0,
  payment_day_of_month:0
}

export const confirmConfig = {
  terms: {
    title: 'Terms & Agreement Stage',
    message: 'Are you sure you want to complete T & A stage',
    variant: 'warning',
  },
  payment: {
    title: 'Payment Setup Stage',
    message: 'Are you sure you want to complete payment stage',
    variant: 'warning',
  },
  mortgage: {
    title: 'Mortgage Activation',
    message: 'Are you sure you want to activate mortgage for this user',
    variant: 'warning',
  },
  identity: {
    title: 'Identity Verification',
    message: 'Are you sure you want to complete Verification stage for this user',
    variant: 'warning',
  },
  property: {
    title: 'Property Selection',
    message: 'Are you sure you want to complete property selection for this user',
    variant: 'warning',
  },

} as const;


export const STAGE_EMPTY_CONFIG = [
  {
    title: 'Identity Verification Stage',
    subtitle: 'User Identity Verification Stage.',
    message: 'User is yet to reach identity verification stage.',
    Icon: icon.IdentificationIcon,
  },
  {
    title: 'Property Selection Stage',
    subtitle: 'User Property Selection Stage.',
    message: 'User is yet to reach property selection stage.',
    Icon: icon.HomeIcon,
  },
  {
    title: 'Terms Agreement Stage',
    subtitle: 'User Terms Agreement Stage.',
    message: 'User is yet to reach Terms Agreement stage.',
    Icon: icon.DocumentIcon,
  },
  {
    title: 'Payment Setup Stage',
    subtitle: 'User Payment Setup Stage.',
    message: 'User is yet to reach payment setup stage.',
    Icon: icon.CreditCardIcon,
  },
  {
    title: 'Mortgage Activation Stage',
    subtitle: 'User Mortgage Activation Stage.',
    message: 'User is yet to reach mortgage activation stage.',
    Icon: icon.HomeModernIcon,
  },
];


