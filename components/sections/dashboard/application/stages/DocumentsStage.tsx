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
          {
            label: 'Attachments',
            value: {
              type: 'attachments',
              files: [
                { name: 'pay_stubs'},
                { name: 'tax_returns'},
                { name: 'bank_statements'},
                {name: 'employment_verification'}
              ],
            },
          },
        ]}
      />
    </div>
  )
}