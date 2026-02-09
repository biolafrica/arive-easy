import { useMortgagePayments } from '@/hooks/useSpecialized/useMortgagePayment';
import { formatDate, formatUSD } from '@/lib/formatter';
import { Mortgage,  } from '@/type/pages/dashboard/mortgage';
import * as icon from '@heroicons/react/24/outline';
import Link from 'next/link';
import { PropertyBase } from '@/type/pages/property';
import { InfoCard, InfoItem } from '@/components/common/Item';
import { getOrdinalSuffix } from '@/utils/common/ordinalSuffix';

export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-700 border-green-200',
      icon: <icon.CheckCircleIcon className="w-4 h-4" />,
    },
    pending_verification: {
      label: 'Pending Verification',
      className: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: <icon.ClockIcon className="w-4 h-4" />,
    },
    pending_payment_method: {
      label: 'Setup Required',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <icon.CreditCardIcon className="w-4 h-4" />,
    },
    payment_failed: {
      label: 'Payment Failed',
      className: 'bg-red-100 text-red-700 border-red-200',
      icon: <icon.ExclamationCircleIcon className="w-4 h-4" />,
    },
    paused: {
      label: 'Paused',
      className: 'bg-gray-100 text-gray-700 border-gray-200',
      icon: <icon.PauseCircleIcon className="w-4 h-4" />,
    },
    completed: {
      label: 'Completed',
      className: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: <icon.CheckBadgeIcon className="w-4 h-4" />,
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-600 border-red-200',
      icon: <icon.XCircleIcon className="w-4 h-4" />,
    },
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.className}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    succeeded: { label: 'Paid', className: 'bg-green-100 text-green-700' },
    scheduled: { label: 'Scheduled', className: 'bg-gray-100 text-gray-600' },
    pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
    processing: { label: 'Processing', className: 'bg-blue-100 text-blue-700' },
    failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-500' },
  };

  const config = statusConfig[status] || statusConfig.scheduled;

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}


export function ProgressSection({ mortgage }: { mortgage: Mortgage }) {
  const paidAmount = (mortgage.payments_made || 0) * mortgage.monthly_payment;
  const totalAmount = mortgage.approved_loan_amount;
  const remainingAmount = totalAmount - paidAmount;
  const percentage = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Loan Progress</h3>
          <p className="text-sm text-gray-500">
            {mortgage.payments_made || 0} of {mortgage.total_payments} payments made
          </p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold text-orange-500">{percentage}%</p>
          <p className="text-sm text-gray-500">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-500">Paid</p>
          <p className="text-sm sm:text-base font-semibold text-green-700">
            {formatUSD({ amount: paidAmount })}
          </p>
        </div>
        <div className="p-3 bg-orange-50 rounded-lg">
          <p className="text-xs text-gray-500">Remaining</p>
          <p className="text-sm sm:text-base font-semibold text-orange-700">
            {formatUSD({ amount: remainingAmount })}
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-500">Monthly</p>
          <p className="text-sm sm:text-base font-semibold text-blue-700">
            {formatUSD({ amount: mortgage.monthly_payment })}
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-500">Interest Rate</p>
          <p className="text-sm sm:text-base font-semibold text-purple-700">
            {mortgage.interest_rate_annual}%
          </p>
        </div>
      </div>
    </div>
  );
}


export  function PropertyInfoSection({property}: {property:PropertyBase}) {

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Property Image */}
      {property.images && (
        <div className="h-48 sm:h-64 overflow-hidden">
          <img 
            src={property.images[0]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
        <p className="text-gray-500 flex items-center gap-2">
          <icon.MapPinIcon className="w-4 h-4" />
          {property.address_full || 'Address not available'}
        </p>

        {/* Property Details */}
        {(property.bedrooms || property.bathrooms || property.area_sqm) && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            {property.bedrooms && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <icon.HomeIcon className="w-4 h-4" />
                {property.bedrooms} Beds
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <icon.SparklesIcon className="w-4 h-4" />
                {property.bathrooms} Baths
              </div>
            )}
            {property.area_sqm && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <icon.ArrowsPointingOutIcon className="w-4 h-4" />
                {property.area_sqm.toLocaleString()} sqft
              </div>
            )}
          </div>
        )}

        <Link
          href={`/user-dashboard/properties/${property.id}`}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium mt-4"
        >
          View Property Details
          <icon.ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function PaymentHistoryTable({summary , id}: { summary: boolean , id?: string }) {

  const {mortgagePayments, isLoading, error} = useMortgagePayments({
    filters: {
      mortgage_id:id,
    }
  })
  
  const payments = summary ? mortgagePayments.slice(0, 5) : mortgagePayments;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <icon.CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No payments recorded yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">#</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Due Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Paid On</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-600">
                {payment.payment_number}
              </td>
              <td className="py-3 px-4 text-sm text-gray-900">
                {formatDate(payment.due_date)}
              </td>
              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                {formatUSD({ amount: payment.amount })}
              </td>
              <td className="py-3 px-4">
                <PaymentStatusBadge status={payment.status} />
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {payment.paid_at ? formatDate(payment.paid_at) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LoanDetailsSection({ mortgage }: { mortgage: Mortgage }) {
  return (
    <InfoCard title="Loan Details" columns={2}>
      <InfoItem
        label="Property Value"
        value={formatUSD({ amount: mortgage.property_price })}
      />
      <InfoItem
        label="Down Payment"
        value={formatUSD({ amount: mortgage.down_payment_made })}
      />
      <InfoItem
        label="Loan Amount"
        value={formatUSD({ amount: mortgage.approved_loan_amount })}
      />
      <InfoItem
        label="Interest Rate"
        value={`${mortgage.interest_rate_annual}% per annum`}
      />
      <InfoItem
        label="Loan Term"
        value={`${mortgage.loan_term_months} months (${Math.floor(
          mortgage.loan_term_months / 12
        )} years)`}
      />
      <InfoItem
        label="Monthly Payment"
        value={formatUSD({ amount: mortgage.monthly_payment })}
      />
      <InfoItem
        label="Payment Day"
        value={`${mortgage.payment_day_of_month}${getOrdinalSuffix(
          mortgage.payment_day_of_month
        )} of each month`}
      />
      <InfoItem
        label="First Payment"
        value={
          mortgage.first_payment_date ? formatDate(mortgage.first_payment_date) : "N/A"
        }
      />
      <InfoItem
        label="Final Payment"
        value={
          mortgage.last_payment_date ? formatDate(mortgage.last_payment_date): "N/A"
        }
      />
      <InfoItem
        label="Total Payments"
        value={mortgage.total_payments}
      />
    </InfoCard>
  );
}




