import { DescriptionList } from "@/components/common/DescriptionList";
import { formatUSD, toNumber } from "@/lib/formatter";
import { DocumentInfoTypes, EmploymentInfoType, PersonalInfoType, PropertyPreferenceType } from "@/type/pages/dashboard/approval";
import { formatPreApprovalDocuments } from "@/utils/common/documents";

interface Props {
  data: PersonalInfoType;
}

interface EProps {
  data: EmploymentInfoType;
}

interface PProps {
  data: PropertyPreferenceType;
}

interface DProps {
  data: DocumentInfoTypes;
}

const fallback = '--:--';

export function PersonalInformationSection({ data }: Props) {
  if (!data) return null;
  return (
    <DescriptionList
      title="Personal Information"
      subtitle="Your Personal Details and information"
      items={[
        { label: 'First Name', value: { type: 'text', value: data.first_name || fallback } },
        { label: 'Last Name', value: { type: 'text', value: data.last_name || fallback } },
        { label: 'Email Address', value: { type: 'text', value: data.email || fallback } },
        { label: 'Phone Number', value: { type: 'text', value: data.phone_number || fallback } },
        { label: 'Date of Birth', value: { type: 'text', value: data.date_of_birth || fallback } },

        { label: 'Street', value: { type: 'text', value: data.address?.street || fallback } },
        { label: 'Street 2', value: { type: 'text', value: data.address?.street2 || fallback } },
        { label: 'City', value: { type: 'text', value: data.address?.city || fallback } },
        { label: 'State', value: { type: 'text', value: data.address?.state || fallback } },
        { label: 'Postal Code', value: { type: 'text', value: data.address?.postal_code || fallback } },
        { label: 'Country', value: { type: 'text', value: data.address?.country || fallback } },

        { label: 'Marital Status', value: { type: 'text', value: data.marital_status || fallback } },
        { label: 'Dependant', value: { type: 'text', value: data.dependant ?? fallback } },
        { label: 'Visa Status', value: { type: 'text', value: data.visa_status || fallback } },
      ]}
    />
  );
}

export function EmploymentInformationSection({ data }: EProps) {
  if (!data) return null;
  return (
    <DescriptionList
      title="Employment Information"
      subtitle="Your Employment Details and information"
      items={[
        { label: 'Employment Status', value: { type: 'text', value: data.employment_status || fallback } },
        { label: 'Employer Name', value: { type: 'text', value: data.employer_name || fallback } },
        { label: 'Job Title', value: { type: 'text', value: data.job_title || fallback } },
        { label: 'Current Job Years', value: { type: 'text', value: data.current_job_years || fallback } },
        { label: 'Employment Type', value: { type: 'text', value: data.employment_type || fallback } },
        {
          label: 'Gross Income',
          value: {
            type: 'text',
            value: data.gross_income
              ? formatUSD({ amount: toNumber(data.gross_income),fromCents: false, decimals: 2,})
              : fallback,
          },
        },
        {
          label: 'Other Income',
          value: {
            type: 'text',
            value: formatUSD({
              amount: toNumber(data.other_income || 0),
              fromCents: false,
              decimals: 2,
            }),
          },
        },

        { label: 'Income Frequency', value: { type: 'text', value: data.income_frequency || fallback } },
        { label: 'Business Type', value: { type: 'text', value: data.business_type || fallback } },
        { label: 'Incorporation Years', value: { type: 'text', value: data.incorporation_years || fallback } },
      ]}
    />
  );
}

export function PropertyPreferenceSection({ data }: PProps) {
  if (!data) return null;
  return (
    <DescriptionList
      title="Property Preference"
      subtitle="Your Initial Property Preferences"
      items={[
        { label: 'Property Type', value: { type: 'text', value: data.property_type || fallback } },

        {
          label: 'Property Value',
          value: {
            type: 'text',
            value: data.property_value
            ? formatUSD({ amount: toNumber(data.property_value),fromCents: false, decimals: 2})
            : fallback,
          },
        },

        {
          label: 'Down Payment Amount',
          value: {
            type: 'text',
            value: formatUSD({amount: toNumber(data.down_payment_amount || 0), 
              fromCents: false, decimals: 2,
            }),
          },
        },

        {
          label: 'Preferred Loan Term',
          value: {
            type: 'text',
            value: data.preffered_loan_term ? `${data.preffered_loan_term} years`
            : fallback,
          },
        },
        {
          label: 'Mortgage Type',
          value: {
            type: 'text',
            value: data.mortgage_options ? `${data.mortgage_options}`
            : fallback,
          },
        },

        {
          label: 'Other Loan Amount',
          value: {
            type: 'text',
            value: formatUSD({
              amount: toNumber(data.other_loan_amount || 0),
              fromCents: false, decimals: 2,
            }),
          },
        },

        { label: 'Existing Mortgage', value: { type: 'text', value: data.existing_mortgage || fallback } },
      ]}
    />
  );
}

export function DocumentsInformationSection({ data }: DProps) {
  if (!data) return null;

  const files = formatPreApprovalDocuments(data);
  if (files.length === 0) return null;

  return (
    <DescriptionList
      title="Documents Information"
      subtitle="Your Pre-Approvals Submitted Documents"
      items={[
        {
          label: 'Attachments',
          value: {
            type: 'attachments',
            files,
          },
        },
      ]}
    />
  );
}


