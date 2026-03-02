'use client';

import { ApplicationBase } from "@/type/pages/dashboard/application";
import { PaymentSetupData } from "./PaymentSetupStage";
import { formatUSD } from "@/lib/formatter";

interface PaymentSummaryProps {
  application: ApplicationBase;
  paymentData: PaymentSetupData;
}

export function PaymentSummary({
  application,
  paymentData,
}: PaymentSummaryProps) {



  return (
    <div className="bg-white rounded-lg border p-4">

      <div className="grid grid-cols-2 gap-4 text-sm">

        <div>
          <p className="text-gray-600">Property Value</p>
          <p className="font-semibold">{formatUSD({amount:application.property_price})}</p>
        </div>

        <div>
          <p className="text-gray-600">
            Down Payment
          </p>

          <p className="font-semibold">
            {formatUSD({amount:application.down_payment_amount})}
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