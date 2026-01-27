'use client';

import { ApplicationBase } from "@/type/pages/dashboard/application";

interface PaymentSummaryProps {
  application: ApplicationBase;
  paymentData: any;
  suggestedDownPayment: number;
  remainingLoanAmount: number;
}

export function PaymentSummary({
  application,
  paymentData,
  suggestedDownPayment,
  remainingLoanAmount
}: PaymentSummaryProps) {
  const totalRequired = paymentData.down_payment_amount + (paymentData.legal_fee_amount || 0) + (paymentData.valuation_fee_amount || 0);
  const totalPaid = paymentData.total_fees_paid || 0;

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Payment Summary</h3>
        <span className="text-sm text-blue-600">
          {Math.round((totalPaid / Math.max(totalRequired, 1)) * 100)}% Complete
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Property Value</p>
          <p className="font-semibold">${application.property_price.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Down Payment</p>
          <p className="font-semibold">
            ${paymentData.down_payment_amount > 0 
              ? paymentData.down_payment_amount.toLocaleString()
              : suggestedDownPayment.toLocaleString()
            }
          </p>
        </div>
        <div>
          <p className="text-gray-600">Remaining Loan</p>
          <p className="font-semibold">${remainingLoanAmount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Monthly Payment</p>
          <p className="font-semibold">${application.monthly_payment?.toLocaleString() || 'TBD'}</p>
        </div>
      </div>

      {totalRequired > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Required</span>
            <span className="font-semibold">${totalRequired.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${Math.min((totalPaid / totalRequired) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}