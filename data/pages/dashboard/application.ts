import { StatusConfig, TableColumn } from "@/components/common/DataTable";
import { formatDate } from "@/lib/formatter";
import { ApplicationStage, MockApplications } from "@/type/pages/dashboard/application";

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

export const columns: TableColumn<MockApplications>[] = [
  { key: 'application_number', header: 'Approval ID', sortable: false},
  { key: 'property', header: 'Property', sortable: false, accessor: (row) => row.properties?.title || 'ongoing'},
  { key: 'current_stage', header: 'Current stage', sortable: false,},
  { key: 'created_at', header: 'Date Created', sortable: false, accessor: (row) => formatDate(row.created_at)},
];

export const statusConfig: StatusConfig[] = [
  { value: 'approved', label: 'Approved', variant: 'green' },
  { value: 'rejected', label: 'Rejected', variant: 'red' },
  { value: 'draft', label: 'Draft', variant: 'yellow' },
];

export const MOCK_DATA: MockApplications[] = [
  {
    id: "PA-1001",
    property_id: "PR-2001",
    application_number: "APP-3001",
    current_stage: "Identity Verification",
    created_at: "2024-05-01T10:15:30Z",
    properties: {
      title: "123 Maple Street",
      address: "123 Maple Street, Springfield, IL",
    },
    status: "draft",
    updated_at: "2024-05-02T12:00:00Z",
  },
  {
    id: "PA-1002",
    property_id: "PR-2002",
    application_number: "APP-3002",
    current_stage: "Mortgage Activation",
    created_at: "2024-05-03T11:20:45Z",
    properties: {
      title: "456 Oak Avenue",
      address: "456 Oak Avenue, Lincoln, NE",
    },
    status: "approved",
    updated_at: "2024-05-04T13:30:00Z",
  }
   
];

export function usePreApplications(queryParams?: Record<string, any>) {
  return {
    applications:MOCK_DATA,
    isLoading: false,
  }
}