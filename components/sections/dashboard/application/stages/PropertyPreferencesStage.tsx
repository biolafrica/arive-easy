import { ApplicationBase } from "@/type/pages/dashboard/application";
import { PropertyPreferenceSection } from "../common/ApplicationDescriptionList";

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
      <PropertyPreferenceSection data={stageData} />
    </div>
  )
}