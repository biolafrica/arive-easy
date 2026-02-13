import { ApplicationBase } from "@/type/pages/dashboard/application";
import { DocumentsInformationSection } from "../common/ApplicationDescriptionList";

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
      <DocumentsInformationSection data={stageData} />
    </div>
  )
}