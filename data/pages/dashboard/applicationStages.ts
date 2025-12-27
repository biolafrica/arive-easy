export interface ApplicationStage {
  step: number;
  key: string;
  title: string;
  description: string;
  requiresAction: boolean;
  actionLabel?: string;
}

export const APPLICATION_STAGE: ApplicationStage[] = [
  {
    step: 1,
    key: 'pre_approval_submitted',
    title: 'Pre-Approval Submitted',
    description:
      'We’ve received your pre-approval application and are currently reviewing your information.',
    requiresAction: false,
  },
  {
    step: 2,
    key: 'pre_approved',
    title: 'Pre-Approved',
    description:
      'Your pre-approval has been approved. You can now select a property of your choice and submit it to continue.',
    requiresAction: true,
    actionLabel: 'Select Property',
  },
  {
    step: 3,
    key: 'developer_review',
    title: 'Developer Review',
    description:
      'The property developer is reviewing your application and confirming availability and terms.',
    requiresAction: false,
  },
  {
    step: 4,
    key: 'verification_required',
    title: 'Verification Required',
    description:
      'Please complete document verification and credit checks. Upload the required documents and submit for review.',
    requiresAction: true,
    actionLabel: 'Complete Verification',
  },
  {
    step: 5,
    key: 'verification_completed',
    title: 'Verification Completed',
    description:
      'Your documents have been verified successfully. The bank is now reviewing everything.',
    requiresAction: false,
  },
  {
    step: 6,
    key: 'offer_letter',
    title: 'Offer Letter Available',
    description:
      'The bank has issued an offer letter. Please review the terms and accept or decline to proceed.',
    requiresAction: true,
    actionLabel: 'Review Offer Letter',
  },
  {
    step: 7,
    key: 'down_payment',
    title: 'Down Payment Required',
    description:
      'Thank you for accepting the offer. Please proceed to make your required down payment.',
    requiresAction: true,
    actionLabel: 'Make Down Payment',
  },
  {
    step: 8,
    key: 'final_confirmation',
    title: 'Final Review & Confirmation',
    description:
      'Your payment was successful. Review final documents, repayment schedule, and confirm to complete your mortgage setup.',
    requiresAction: true,
    actionLabel: 'Confirm & Submit',
  },
];


