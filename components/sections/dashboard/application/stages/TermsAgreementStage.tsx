import { ApplicationBase } from "@/type/pages/dashboard/application";

interface Props {
  application: ApplicationBase;
  stageData?: any; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}


export default function TermsAgreementStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props){
  return(
    <div>
      <h4>Terms and Agreement Page</h4>
    </div>
  )
}