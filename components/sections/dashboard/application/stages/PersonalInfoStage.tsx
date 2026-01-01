import { DescriptionList } from "@/components/common/DescriptionList";
import { ApplicationBase } from "@/type/pages/dashboard/application";

interface Props {
  application: ApplicationBase;
  stageData?: any; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

export default function PersonalInfoStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props){
  return(
    <div>
      <DescriptionList
        title="Personal Information"
        subtitle="Your Personal Details and information"
        items={[
          { label: 'First Name', value: { type: 'text', value: stageData.first_name }},
          { label: 'Last Name', value: { type: 'text', value: stageData.last_name }},
          { label: 'Email Address', value: { type: 'text', value: stageData.email }},
          { label: 'Phone Number', value: { type: 'text', value: stageData.phone_number}},
          { label: 'Date of Birth', value: { type: 'text', value: stageData.date_of_birth }},
          { label: 'Residence Country', value: { type: 'text', value: stageData.residence_country }},
          { label: 'Marital Status', value: { type: 'text', value: stageData.marital_status }},
          { label: 'Dependant', value: { type: 'text', value: stageData.dependant }},
          { label: 'Visa Status', value: { type: 'text', value: stageData.visa_status }},
        ]}
      />
    </div>
  )
}