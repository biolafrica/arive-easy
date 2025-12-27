import { ApplicationStage } from "@/type/pages/dashboard/application";

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
