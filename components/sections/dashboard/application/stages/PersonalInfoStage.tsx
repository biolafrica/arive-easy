import { ApplicationBase } from "@/type/pages/dashboard/application";
import { PersonalInformationSection } from "../common/ApplicationDescriptionList";

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
      <PersonalInformationSection
        data={stageData}
      />
    </div>
  )
}