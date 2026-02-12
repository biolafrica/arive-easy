'use client';

import Link from 'next/link';
import { formatDate, formatUSD } from '@/lib/formatter';
import { Button } from '@/components/primitives/Button';
import { MortgageCardProps, MortgageStatus } from '@/type/pages/dashboard/property';
import { StatusBadge } from '@/components/sections/dashboard/mortgage/MortgageUtils';


function LoanProgressBar({ 
  paid, 
  total,
  paymentsMade,
  totalPayments 
}: { 
  paid: number; 
  total: number;
  paymentsMade: number;
  totalPayments: number;
}) {
  const percentage = total > 0 ? Math.round((paid / total) * 100) : 0;
  const remaining = total - paid;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Loan Progress</span>
        <span className="text-2xl font-bold text-orange-500">{percentage}%</span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-orange-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          {formatUSD({ amount: paid })} paid
        </span>
        <span className="text-gray-600">
          {formatUSD({ amount: remaining })} remaining
        </span>
      </div>

      <p className="text-xs text-gray-500 text-center">
        {paymentsMade} of {totalPayments} payments made
      </p>
    </div>
  );
}

function DetailRow({ 
  label, 
  value, 
  valueClassName = '' 
}: { 
  label: string; 
  value: string | number; 
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold text-gray-900 ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}

export function MortgageCard({ mortgage, onMakePayment }: MortgageCardProps) {
  console.log('Rendering MortgageCard with mortgage:', mortgage);
  const {
    id,
    property_price,
    approved_loan_amount,
    interest_rate_annual,
    monthly_payment,
    payments_made = 0,
    total_payments,
    next_payment_date,
    last_payment_date,
    status,
    properties,
  } = mortgage;

  const paidAmount = payments_made * monthly_payment;
  const totalLoanAmount = approved_loan_amount;

 

  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
            {properties?.title || 'Property'}
          </h3>
          <p className="text-gray-500 text-sm mt-1 truncate">
            {properties?.address_full || 'Address not available'}
          </p>
        </div>
        <StatusBadge status={status as MortgageStatus} />
      </div>

      <div className="space-y-0">
        <DetailRow 
          label="Property Value" 
          value={formatUSD({ amount: property_price })} 
        />
        <DetailRow 
          label="Loan Balance" 
          value={formatUSD({ amount: totalLoanAmount - paidAmount })} 
        />
        <DetailRow 
          label="Interest Rate" 
          value={`${interest_rate_annual}%`} 
        />
        <DetailRow 
          label="Monthly Payment" 
          value={formatUSD({ amount: monthly_payment })}
          valueClassName="text-orange-500"
        />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <LoanProgressBar 
          paid={paidAmount}
          total={totalLoanAmount}
          paymentsMade={payments_made}
          totalPayments={total_payments}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-sm text-gray-500">Next Payment Due</p>
          <p className="font-semibold text-gray-900">
            {status === 'completed' ? 'Completed' : formatDate(next_payment_date || '')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Mortgage End Date</p>
          <p className="font-semibold text-gray-900">
            {formatDate(last_payment_date)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {status === 'active' && onMakePayment && (
          <Button
            className="flex-1"
            onClick={() => onMakePayment(id)}
          >
            Make Payment
          </Button>
        )}
        
        <Link href={`/user-dashboard/properties/${id}/mortgages`} className="flex-1">
          <Button 
            variant='outline'
            className="w-full"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

