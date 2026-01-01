import { ApplicationBase } from "@/type/pages/dashboard/application";
import { VerificationFeeInfo } from "./InfoBanner";
import VerificationClientView from "./VerificationClientView";

interface Props {
  application: ApplicationBase;
  stageData?: any; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

const getHasPaid=(status:string)=>{
  return status === "paid" ? true : false
}

export default function IdentityVerificationStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props){
  return(
    <div className="space-y-8">

      
      <VerificationFeeInfo />

      <VerificationClientView 
        hasPaid={getHasPaid(application.processing_fee_payment_status)} 
        application_id={application.id}
      />
    </div>
  )
}