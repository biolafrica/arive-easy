'use client';

import { ApplicationBase } from "@/type/pages/dashboard/application";
import { LegalValuationFeesSection } from './LegalValuationFeesSection';
import {PaymentSummary } from './PaymentSummary';
import { ClockIcon } from "@heroicons/react/24/outline";


interface Props {
  application: ApplicationBase;
  stageData?: PaymentSetupData; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}

export interface PaymentSetupData {
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
 
  return (
    <div className="space-y-8">

      <PaymentSummary
        application={application}
        paymentData={paymentData}
      />

      {(application.legal_fee === 0 && application.valuation_fee === 0) && (
        <div className='bg-yellow-50 border-yellow-200 border rounded-lg p-4 mb-6'>
          <div className="flex items-start gap-3">
            <ClockIcon className='h-6 w-6 text-yellow-600' />
            <div className="flex-1">
              <h3 className='font-semibold text-yellow-800'>
                Additional Fee Information Pending
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                The legal and valuation fees for this application have not been set yet. Please check back later for updates.
              </p>
            </div>
          </div>
        </div>
      )}

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