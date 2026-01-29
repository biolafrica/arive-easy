'use client';

import { ApplicationBase } from "@/type/pages/dashboard/application";
import { DownPaymentSection } from './payment-setup/DownPaymentSection';
import { LegalValuationFeesSection } from './payment-setup/LegalValuationFeesSection';
import {PaymentSummary } from './payment-setup/PaymentSummary';


interface Props {
  application: ApplicationBase;
  stageData?: PaymentSetupData; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

export interface PaymentSetupData {
  down_payment_amount: number;
  down_payment_status: 'pending' | 'paid' | 'escrowed' | 'released' | 'refunded';
  down_payment_transaction_id?: string;
  down_payment_date?: string;
  legal_fee_amount?: number;
  legal_fee_status?: 'pending' | 'paid';
  legal_fee_transaction_id?: string;
  legal_fee_date?:string;
  valuation_fee_amount?: number;
  valuation_fee_status?: 'pending' | 'paid';
  valuation_fee_transaction_id?: string;
  valuation_fee_date?:string;

  total_fees_paid: number;
}

export default function PaymentSetupStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props) {

  const paymentData:PaymentSetupData = {
    down_payment_amount: stageData?.down_payment_amount || 0,
    down_payment_status: stageData?.down_payment_status || 'pending',
    down_payment_date: stageData?.down_payment_date || "",
    down_payment_transaction_id: stageData?.down_payment_transaction_id || "",
    legal_fee_amount: stageData?.legal_fee_amount || 0,
    legal_fee_status: stageData?.legal_fee_status || 'pending',
    legal_fee_date: stageData?.legal_fee_date || "",
    legal_fee_transaction_id: stageData?.legal_fee_transaction_id || "",
    valuation_fee_amount: stageData?.valuation_fee_amount|| 0,
    valuation_fee_status: stageData?.valuation_fee_status ||  'pending',
    valuation_fee_date: stageData?.valuation_fee_date || '' ,
    valuation_fee_transaction_id: stageData?.valuation_fee_transaction_id ||"",
    total_fees_paid: 0,

  } 

  const suggestedDownPayment = Math.round(
    (application.property_price * application.down_payment_percentage) / 100
  );
 
  return (
    <div className="space-y-8">

      <PaymentSummary
        application={application}
        paymentData={paymentData}
        suggestedDownPayment={suggestedDownPayment}
      />

      <DownPaymentSection
        application={application}
        paymentData={paymentData}
        suggestedDownPayment={suggestedDownPayment}
        isReadOnly={isReadOnly}
        isUpdating={isUpdating}
      />

      {(application.legal_fee > 0 || application.valuation_fee > 0) && (
        <LegalValuationFeesSection
          application={application}
          paymentData={paymentData}
          isReadOnly={isReadOnly}
          isUpdating={isUpdating}
        />
      )}

    </div>
  );
}