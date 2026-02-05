import { Button } from "@/components/primitives/Button";
import { formatDate, formatUSD } from "@/lib/formatter";
import * as icon from "@heroicons/react/24/outline";

export type SetupStep = 'review' | 'payment_method' | 'confirmation' | 'success';

interface ReviewStepProps {
  loanDetails: {
    loanAmount: number;
    monthlyPayment: number;
    totalPayments: number;
    firstPaymentDate?: string;
    lastPaymentDate?: string;
    paymentDayOfMonth: number;
    interestRate: number;
  };
  onProceed: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function ReviewStep({ loanDetails, onProceed, isLoading, error }: ReviewStepProps) {
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="space-y-6">
      {/* Loan Summary Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Your Mortgage Payment Plan</h3>
          <p className="text-blue-100 text-sm mt-1">Review your payment details before setting up automatic payments</p>
        </div>

        <div className="p-6">
          {/* Monthly Payment Highlight */}
          <div className="text-center py-6 border-b border-gray-100">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Monthly Payment</p>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {formatUSD({ amount: loanDetails.monthlyPayment })}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Due on the {loanDetails.paymentDayOfMonth}{getOrdinalSuffix(loanDetails.paymentDayOfMonth)} of each month
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6 py-6">
            <DetailItem
              icon={<icon.BanknotesIcon className="w-5 h-5 text-blue-600" />}
              label="Loan Amount"
              value={formatUSD({ amount: loanDetails.loanAmount })}
            />
            <DetailItem
              icon={<icon.CurrencyDollarIcon className="w-5 h-5 text-blue-600" />}
              label="Total Payments"
              value={formatUSD({ amount: loanDetails.totalPayments })}
            />
            <DetailItem
              icon={<icon.CalendarDaysIcon className="w-5 h-5 text-blue-600" />}
              label="First Payment"
              value={loanDetails.firstPaymentDate ? formatDate(loanDetails.firstPaymentDate) : 'To be determined'}
            />
            <DetailItem
              icon={<icon.CalendarDaysIcon className="w-5 h-5 text-blue-600" />}
              label="Final Payment"
              value={loanDetails.lastPaymentDate ? formatDate(loanDetails.lastPaymentDate) : 'To be determined'}
            />
          </div>

          {/* Interest Rate Note */}
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p>
              <span className="font-medium">Interest Rate:</span> {loanDetails.interestRate}% per annum
            </p>
            <p className="mt-1">
              Your monthly payment includes principal and interest. Payment amounts are fixed for the duration of your loan term.
            </p>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-800">Before You Continue</h4>
        <ul className="mt-2 text-sm text-amber-700 space-y-1">
          <li>• Payments will be automatically deducted from your bank account</li>
          <li>• Ensure sufficient funds are available before each payment date</li>
          <li>• You can update your payment method at any time</li>
          <li>• Contact support if you need to adjust your payment schedule</li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={onProceed}
        disabled={isLoading}
        className="w-full"
        size="lg"
      > Set Up Automatic Payments </Button>

    </div>
  );
}

function DetailItem({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}