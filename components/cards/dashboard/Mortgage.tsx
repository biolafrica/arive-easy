'use client';

import Link from 'next/link';
import { formatDate, formatUSD } from '@/lib/formatter';
import { Button } from '@/components/primitives/Button';
import { Mortgage, MortgageForm } from '@/type/pages/dashboard/mortgage';
import { MortgageCardSkeleton } from '@/components/skeleton/MortgageCradSkeleton';


interface MortgageCardProps {
  mortgage: MortgageForm;
  onMakePayment?: (mortgageId: string) => void;
}

type MortgageStatus = 'active' | 'pending_verification' | 'pending_payment_method' | 'payment_failed' | 'paused' | 'completed' | 'cancelled';


function StatusBadge({ status }: { status: MortgageStatus }) {
  const statusConfig: Record<MortgageStatus, { label: string; className: string }> = {
    active: {
      label: 'Active Mortgage',
      className: 'bg-green-100 text-green-700',
    },
    pending_verification: {
      label: 'Pending Verification',
      className: 'bg-amber-100 text-amber-700',
    },
    pending_payment_method: {
      label: 'Setup Required',
      className: 'bg-blue-100 text-blue-700',
    },
    payment_failed: {
      label: 'Payment Failed',
      className: 'bg-red-100 text-red-700',
    },
    paused: {
      label: 'Paused',
      className: 'bg-gray-100 text-gray-700',
    },
    completed: {
      label: 'Completed',
      className: 'bg-purple-100 text-purple-700',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-600',
    },
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}


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
    property,
  } = mortgage;

  const paidAmount = payments_made * monthly_payment;
  const totalLoanAmount = approved_loan_amount;

 

  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
            {property?.title || 'Property'}
          </h3>
          <p className="text-gray-500 text-sm mt-1 truncate">
            {property?.address_full || 'Address not available'}
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
            variant="outline"
            className="flex-1"
            onClick={() => onMakePayment(id)}
          >
            Make Payment
          </Button>
        )}
        
        <Link href={`/user-dashboard/mortgages/${id}`} className="flex-1">
          <Button 
            variant={status === 'active' && onMakePayment ? 'ghost' : 'outline'}
            className="w-full"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

