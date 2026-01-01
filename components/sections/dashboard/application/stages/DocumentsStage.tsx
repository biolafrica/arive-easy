import { DescriptionList } from "@/components/common/DescriptionList";
import { ApplicationBase } from "@/type/pages/dashboard/application";

interface Props {
  application: ApplicationBase;
  stageData?: any; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

export default function DocumentsStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props){
  return(
    <div>
      <DescriptionList
        title="Documents Information"
        subtitle="Your Pre Approvals Submitted Documents."
        items={[
          { label: 'Identity Type', value: { type: 'text', value: stageData.identity_type }},
          { label: 'Payslip Start Date', value: { type: 'text', value: stageData.payslip_start_date }},
          { label: 'Payslip End Date', value: { type: 'text', value: stageData.payslip_end_date }},
          { label: 'Bank Statement Start Date', value: { type: 'text', value: stageData.bank_statement_start_date }},
          { label: 'Bank Statement End Date', value: { type: 'text', value: stageData.bank_statement_end_date }},
          { label: 'Other Documents', value: { type: 'text', value: stageData.other_document_name || "--:--" }},
          {
            label: 'Attachments',
            value: {
              type: 'attachments',
              files: [
                { name: 'identity_proof'},
                { name: 'payslip'},
                { name: 'bank_statement'},
                {name: 'other_documents'}
              ],
            },
          },
        ]}
      />
    </div>
  )
}