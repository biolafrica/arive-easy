export type PreApprovalStatus =
  | 'not_started'
  | 'incomplete'
  | 'under_review'
  | 'approved'
  | 'approved_with_conditions'
  | 'rejected_with_guidance'
  | 'expired';