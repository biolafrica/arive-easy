import { DescriptionList } from "@/components/common/DescriptionList";
import { formatCurrency } from "@/lib/formatter";
import { ApplicationBase } from "@/type/pages/dashboard/application";

interface Props {
  application: ApplicationBase;
  stageData?: any; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

export default function PropertyPreferencesStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props){
  return(
    <div>
      <DescriptionList
        title="Property Preference"
        subtitle="Your Initial Property Preferences"
        items={[
          { label: 'Property Type', value: { type: 'text', value: stageData.property_type}},
          { label: 'Property Value', value: { type: 'text', value: formatCurrency(stageData.property_value)}},
          { label: 'Down Payment Amount', value: { type: 'text', value: formatCurrency(stageData.down_payment_amount)}},
          { label: 'Preffered Loan Term', value: { type: 'text', value: `${stageData.preffered_loan_term}years`}},
          { label: 'Other Loan Amount', value: { type: 'text', value: formatCurrency(stageData.other_loan_amount) || "--:--"}},
          { label: 'Exixting Mortgage', value: { type: 'text', value: stageData.existing_mortgage || "--:--"}},
        ]}
      />
    </div>
  )
}