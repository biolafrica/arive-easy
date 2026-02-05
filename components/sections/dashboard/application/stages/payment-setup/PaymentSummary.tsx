'use client';

import { ApplicationBase } from "@/type/pages/dashboard/application";
import { PaymentSetupData } from "./PaymentSetupStage";
import { formatUSD } from "@/lib/formatter";

interface PaymentSummaryProps {
  application: ApplicationBase;
  paymentData: PaymentSetupData;
  suggestedDownPayment: number;
}

export function PaymentSummary({
  application,
  paymentData,
  suggestedDownPayment,
}: PaymentSummaryProps) {


  let status = 0;
  if (paymentData.valuation_fee_amount){
    status = status + 25
  }
  if( paymentData.down_payment_amount){
    status = status + 50
  }

  if (paymentData.legal_fee_amount){
    status = status + 25
  }

  return (
    <div className="bg-white rounded-lg border p-4">

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Payment Summary</h3>
        <span className="text-sm text-blue-600">
          {status}% Complete
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>
          <p className="text-gray-600">Property Value</p>
          <p className="font-semibold">{formatUSD({amount:application.property_price, fromCents:false})}</p>
        </div>

        <div>
          <p className="text-gray-600">
            {paymentData.down_payment_amount > 0 ? 'Down Payment': 'Suggested Down Payment'}
          </p>

          <p className="font-semibold">
            {paymentData.down_payment_amount > 0 
              ? `${formatUSD({amount: paymentData.down_payment_amount, fromCents:false})}`
              : `${formatUSD({amount: suggestedDownPayment, fromCents:false})}`
            }
          </p>
        </div>

        {paymentData.legal_fee_status === 'paid' && (
          <div>
            <p className="text-gray-600">Legal Fee</p>
            <p className="font-semibold">
              {formatUSD({amount: paymentData.legal_fee_amount || 0, fromCents:false})}
            </p>
          </div>
        )}  

        {paymentData.valuation_fee_status === 'paid' && (
          <div>
            <p className="text-gray-600">Valuation Fee</p>
            <p className="font-semibold">
              {formatUSD({amount: paymentData.valuation_fee_amount || 0, fromCents:false})}
            </p>
          </div>
        )} 

      </div>

    </div>
  );
}