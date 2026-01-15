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
          {label: 'Attachments',
            value: {
              type: 'attachments',
              files: [ 
                stageData?.pay_stubs && {name: 'Pay Stubs', url:stageData.pay_stubs},
                stageData?.tax_returns && {name: 'Tax Returns',url: stageData.tax_returns},
                stageData?.bank_statements && { name: 'Bank Statements', url: stageData.bank_statements},
                stageData?.employment_verification && { name: 'Employment Verification',url: stageData.pay_stubs?.employment_verification}
              ].filter(Boolean) as any,
            },
          },
        ]}
      />
    </div>
  )
}