import { ApplicationBase } from "@/type/pages/dashboard/application";
import AgreementClientView from "./AgreementClientView";
import { DownPaymentSection } from "../payment-setup/DownPaymentSection";

interface Props {
  application: ApplicationBase;
  stageData?: TermsAgreementData; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

export interface TermsAgreementData {
  down_payment_amount: number;
  down_payment_status: 'pending' | 'paid' | 'escrowed' | 'released' | 'refunded';
  down_payment_transaction_id?: string;
  down_payment_date?: string;
  terms_agreement_signed: boolean;
}


export default function TermsAgreementStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props){

  const suggestedDownPayment = Math.round(
    application.property_price * (20 / 100)
  );

  const termsData:TermsAgreementData = {
    down_payment_amount: stageData?.down_payment_amount || 0,
    down_payment_status: stageData?.down_payment_status || 'pending',
    down_payment_date: stageData?.down_payment_date || "",
    down_payment_transaction_id: stageData?.down_payment_transaction_id || "",
    terms_agreement_signed: stageData?.terms_agreement_signed || false,
  }
  
  return(
    <div>

      <DownPaymentSection
        application={application}
        paymentData={termsData}
        suggestedDownPayment={suggestedDownPayment}
        isReadOnly={isReadOnly}
        isUpdating={isUpdating}
      />

      { stageData?.down_payment_status === 'escrowed' && (
        <AgreementClientView id={application.id}/>
      )}

    </div>
  )
}