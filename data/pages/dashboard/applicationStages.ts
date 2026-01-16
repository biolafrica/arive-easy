import { ApplicationBase, ApplicationStageKey } from "@/type/pages/dashboard/application";

export interface ValidationRule {
  field: string;
  rule: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface StageConfig {
  step: number;
  key: ApplicationStageKey;
  title: string;
  description: string;
  requiresAction: boolean;
  actionLabel?: string;
  validationRules?: ValidationRule[];
  requiredFields?: string[];
  nextStageCondition?: (data: ApplicationBase) => boolean;
}

export const STAGE_CONFIGURATIONS: StageConfig[] = [
  {
    step: 1,
    key: 'personal_info',
    title: 'Personal Information',
    description: 'Basic personal and contact information from pre-approval',
    requiresAction: false,
    requiredFields: ['legal_full_name', 'date_of_birth', 'citizenship_country']
  },
  {
    step: 2,
    key: 'employment_info',
    title: 'Employment Information',
    description: 'Employment and income details from pre-approval',
    requiresAction: false,
    requiredFields: ['employment_status', 'monthly_gross_income']
  },
  {
    step: 3,
    key: 'property_preferences',
    title: 'Property Preferences',
    description: 'Property preferences and financial capacity',
    requiresAction: false,
    requiredFields: ['max_property_price', 'down_payment_amount']
  },
  {
    step: 4,
    key: 'documents_upload',
    title: 'Document Information',
    description: 'Pre-approval documents have been submitted',
    requiresAction: false,
  },
  {
    step: 5,
    key: 'identity_verification',
    title: 'Identity Verification (KYC)',
    description: 'Complete identity verification with our partners',
    requiresAction: true,
    actionLabel: 'Complete Verification',
    nextStageCondition: (app) => app.kyc_status === 'verified'
  },
   {
    step: 6,
    key: 'property_selection',
    title: 'Property Selection',
    description: 'Select and confirm your property choice',
    requiresAction: true,
    actionLabel: 'Select Property',
    nextStageCondition: (app) => !!app.property_id && app.developer_status === 'approved'
  },
  {
    step: 7,
    key: 'terms_agreement',
    title: 'Terms Agreement & Signing',
    description: 'Review and accept the mortgage terms',
    requiresAction: true,
    actionLabel: 'Review Offer Letter',
    nextStageCondition: (app) => !!app.terms_accepted_at && !!app.contract_signed_at
  },
  {
    step: 8,
    key: 'payment_setup',
    title: 'Payment Setup & Down Payment',
    description: 'Setup payment method and make down payment',
    requiresAction: true,
    actionLabel: 'Make Down Payment',
    nextStageCondition: (app) => !!app.stripe_payment_method_id
  },
  {
    step: 9,
    key: 'mortgage_activation',
    title: 'Mortgage Activation',
    description: 'Final review and mortgage activation',
    requiresAction: true,
    actionLabel: 'Confirm & Submit',
    nextStageCondition: (app) => app.status === 'active'
  }
];

