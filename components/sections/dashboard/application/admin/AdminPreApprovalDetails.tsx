import { DescriptionList } from "@/components/common/DescriptionList";
import { formatUSD, toNumber } from "@/lib/formatter";
import { PreApprovalBase, PreAprovalStatus } from "@/type/pages/dashboard/approval";
import { PreApprovalActions } from "./PreApprovalAction";
import { useAdminPreApprovalStatus } from "@/hooks/useSpecialized/usePreApproval";
import { StatusHeader } from "./StatusHeader";


interface Props {
  pre_approvals: PreApprovalBase;
}

export default function AdminPreApprovalDetails ({ pre_approvals }: Props){
 
  const { updateStatus, isUpdating } = useAdminPreApprovalStatus(pre_approvals.id);

  const handleSubmit = async (data: PreAprovalStatus) => {
    await updateStatus(data);
  };

  return(
    <div>

      <StatusHeader status={pre_approvals.status} />

      <div className="space-y-5 mt-5">

        <DescriptionList
          title="Personal Information"
          subtitle="Your Personal Details and information"
          items={[
            { label: 'First Name', value: { type: 'text', value: pre_approvals.personal_info.first_name }},
            { label: 'Last Name', value: { type: 'text', value: pre_approvals.personal_info.last_name }},
            { label: 'Email Address', value: { type: 'text', value: pre_approvals.personal_info.email}},
            { label: 'Phone Number', value: { type: 'text', value: pre_approvals.personal_info.phone_number}},
            { label: 'Date of Birth', value: { type: 'text', value: pre_approvals.personal_info.date_of_birth}},
            { label: 'Street', value: { type: 'text', value: pre_approvals.personal_info.address?.street || "--:--" }},
            { label: 'Street 2', value: { type: 'text', value: pre_approvals.personal_info.address?.street2 || "--:--" }},
            { label: 'City', value: { type: 'text', value: pre_approvals.personal_info.address?.city || "--:--" }},
            { label: 'State', value: { type: 'text', value: pre_approvals.personal_info.address?.state || "--:--" }},
            { label: 'Postal Code', value: { type: 'text', value: pre_approvals.personal_info.address?.postal_code || "--:--" }},
            { label: 'Country', value: { type: 'text', value: pre_approvals.personal_info.address?.country || "--:--" }},
            { label: 'Marital Status', value: { type: 'text', value: pre_approvals.personal_info.marital_status }},
            { label: 'Dependant', value: { type: 'text', value: pre_approvals.personal_info.dependant }},
            { label: 'Visa Status', value: { type: 'text', value: pre_approvals.personal_info.visa_status }},
          ]}
        />

        <DescriptionList
          title="Employment Information"
          subtitle="Your Employement Details and information"
          items={[
            { label: 'Employment Status', value: { type: 'text', value: pre_approvals.employment_info.employment_status}},
            { label: 'Employer Name', value: { type: 'text', value: pre_approvals.employment_info.employer_name || "--:--"}},
            { label: 'Job Title', value: { type: 'text', value: pre_approvals.employment_info.job_title || "--:--"}},
            { label: 'Current Job Years', value: { type: 'text', value: pre_approvals.employment_info.current_job_years || "--:--"}},
            { label: 'Employment Type', value: { type: 'text', value: pre_approvals.employment_info.employment_type || "--:--" }},
            { label: 'Gross Income', value: { type: 'text', value: formatUSD({amount:toNumber(pre_approvals.employment_info.gross_income), fromCents:false, decimals:2})}},
            { label: 'Other Income', value: { type: 'text', value: formatUSD({amount:toNumber(pre_approvals.employment_info.other_income || 0), fromCents:false, decimals:2})}},
            { label: 'Income Frequency', value: { type: 'text', value: pre_approvals.employment_info.income_frequency }},
            { label: 'Business Type', value: { type: 'text', value: pre_approvals.employment_info.business_type || "--:--"}},
            { label: 'Incorporation Years', value: { type: 'text', value: pre_approvals.employment_info.incorporation_years || "--:--"}},
          ]}
        />

        <DescriptionList
          title="Property Preference"
          subtitle="Your Initial Property Preferences"
          items={[
            { label: 'Property Type', value: { type: 'text', value: pre_approvals.property_info.property_type}},
            { label: 'Property Value', value: { type: 'text', value: formatUSD({amount:toNumber(pre_approvals.property_info.property_value), fromCents:false, decimals:2})}},
            { label: 'Down Payment Amount', value: { type: 'text', value: formatUSD({amount:toNumber(pre_approvals.property_info.down_payment_amount), fromCents:false, decimals:2})}},
            { label: 'Preffered Loan Term', value: { type: 'text', value:`${pre_approvals.property_info.preffered_loan_term}years`}},
            { label: 'Other Loan Amount', value: { type: 'text', value: formatUSD({amount:toNumber(pre_approvals.property_info.other_loan_amount || 0), fromCents:false, decimals:2})}},
            { label: 'Exixting Mortgage', value: { type: 'text', value: pre_approvals.property_info.existing_mortgage || "--:--"}},
          ]}
        />

        <DescriptionList
          title="Documents Information"
          subtitle="Your Pre Approvals Submitted Documents."
          items={[
            {label: 'Attachments',
              value: {
                type: 'attachments',
                files: [ 
                  pre_approvals.document_info?.pay_stubs && {name: 'Pay Stubs', url: pre_approvals.document_info.pay_stubs},
                  pre_approvals.document_info?.tax_returns && {name: 'Tax Returns',url: pre_approvals.document_info.tax_returns},
                  pre_approvals.document_info?.bank_statements && { name: 'Bank Statements', url: pre_approvals.document_info.bank_statements},
                  pre_approvals.document_info?.employment_verification && { name: 'Employment Verification',url: pre_approvals.document_info.employment_verification}
                ].filter(Boolean) as any,
              },
            },
          ]}
        />

      </div>

      <PreApprovalActions
        pre_approvals={pre_approvals}
        onSubmit={handleSubmit}
        isUpdating={isUpdating}
      />


    </div>
  )
}