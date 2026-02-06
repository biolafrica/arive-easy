'use client';

import { CheckCircleIcon, CalendarDaysIcon, BanknotesIcon, ClockIcon } from "@heroicons/react/24/outline";
import { formatDate, formatUSD } from "@/lib/formatter";
import { Button } from "@/components/primitives/Button";
import Link from "next/link";

interface DirectDebitSuccessProps {
  loanDetails: {
    loanAmount: number;
    monthlyPayment: number;
    totalPayments: number;
    firstPaymentDate?: string;
    lastPaymentDate?: string;
    paymentDayOfMonth: number;
    interestRate: number;
  };
  applicationId: string;
  isPendingVerification?: boolean;
}

export function DirectDebitSuccess({ 
  loanDetails, 
  applicationId,
  isPendingVerification = false 
}: DirectDebitSuccessProps) {
  
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
      <div className="text-center py-8">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          isPendingVerification ? 'bg-amber-100' : 'bg-green-100'
        }`}>
          {isPendingVerification ? (
            <ClockIcon className="w-10 h-10 text-amber-600" />
          ) : (
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900">
          {isPendingVerification 
            ? 'Bank Verification in Progress' 
            : 'Automatic Payments Set Up!'
          }
        </h2>
        
        <p className="text-gray-600 mt-2">
          {isPendingVerification 
            ? 'Your bank account is being verified. This usually takes 1-2 business days.'
            : 'Your mortgage payments will be automatically deducted each month.'
          }
        </p>
      </div>

      {isPendingVerification && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ClockIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Verification Pending</h4>
              <p className="text-sm text-amber-700 mt-1">
                For bank accounts, Stripe needs to verify your account details. You'll receive 
                an email once verification is complete. Your first payment will be processed 
                after verification.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className={`border-b px-6 py-4 ${
          isPendingVerification 
            ? 'bg-amber-50 border-amber-100' 
            : 'bg-green-50 border-green-100'
        }`}>
          <h3 className={`font-semibold ${
            isPendingVerification ? 'text-amber-800' : 'text-green-800'
          }`}>
            {isPendingVerification ? 'Payment Schedule (Pending Verification)' : 'Payment Schedule Confirmed'}
          </h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Payment</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatUSD({ amount: loanDetails.monthlyPayment })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Day</p>
                <p className="text-lg font-semibold text-gray-900">
                  {loanDetails.paymentDayOfMonth}{getOrdinalSuffix(loanDetails.paymentDayOfMonth)} of each month
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">First Payment Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {loanDetails.firstPaymentDate
                    ? formatDate(loanDetails.firstPaymentDate)
                    : 'To be confirmed'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Loan Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatUSD({ amount: loanDetails.loanAmount })}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Payments</p>
              <p className="text-lg font-semibold text-gray-900">
                {loanDetails.totalPayments} months
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">What Happens Next?</h4>
        <ul className="space-y-3 text-sm text-blue-800">
          {isPendingVerification ? (
            <>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                <span>Stripe will verify your bank account (1-2 business days)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                <span>You'll receive an email confirmation once verified</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                <span>Your first payment will be scheduled after verification</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">4</span>
                <span>You'll receive reminders 3 days before each payment</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                <span>You'll receive a confirmation email with your payment schedule</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                <span>Your first payment will be processed on {loanDetails.firstPaymentDate ? formatDate(loanDetails.firstPaymentDate) : 'the scheduled date'}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                <span>You'll receive payment reminders 3 days before each payment</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">4</span>
                <span>Payment receipts will be sent to your email after each successful payment</span>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href='/user-dashboard/properties/' className="flex-1">
          <Button variant="outline" className="w-full">
            View Payment Schedule
          </Button>
        </Link>
        <Link href="/user-dashboard" className="flex-1">
          <Button className="w-full">
            Return to Dashboard
          </Button>
        </Link>
      </div>

      <p className="text-center text-sm text-gray-500">
        Need to make changes? Contact our support team at{' '}
        <a href="mailto:support@ariveasy.com" className="text-blue-600 hover:underline">
          support@ariveasy.com
        </a>
      </p>
    </div>
  );
}