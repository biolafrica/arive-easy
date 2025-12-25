
import { cn } from '@/lib/utils';
import { MortgageCardProps, MortgageStatProps } from '@/type/pages/dashboard/property';


export function MortgageCard({
  title,
  address,
  status,
  propertyValue,
  loanBalance,
  interestRate,
  monthlyPayment,
  progressPercent,
  paidAmount,
  remainingAmount,
  nextPaymentDue,
  mortgageEndDate,
  onMakePayment,
}: MortgageCardProps) {
  const isClosed = status === 'closed';

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-heading">
            {title}
          </h3>
          <p className="mt-1 text-sm text-secondary">
            {address}
          </p>
        </div>

        <span
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium',
            status === 'active' && 'bg-green-100 text-green-700',
            status === 'closed' && 'bg-muted text-secondary',
            status === 'pending' && 'bg-yellow-100 text-yellow-700',
            status === 'arrears' && 'bg-red-100 text-red-700'
          )}
        >
          {status === 'active' && 'Active Mortgage'}
          {status === 'closed' && 'Closed Mortgage'}
          {status === 'pending' && 'Pending'}
          {status === 'arrears' && 'In Arrears'}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-6 space-y-4 text-sm">
        <Stat label="Property Value" value={propertyValue} />
        <Stat label="Loan Balance" value={loanBalance} />
        <Stat label="Interest Rate" value={interestRate} />
        <Stat label="Monthly Payment" value={monthlyPayment} highlight />
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary">Loan Progress</span>
          <span className="text-lg font-semibold text-primary">
            {progressPercent}%
          </span>
        </div>

        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-xs text-secondary">
          <span>{paidAmount} paid</span>
          <span>{remainingAmount} remaining</span>
        </div>
      </div>

      {/* Dates */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-secondary">Next Payment Due</p>
          <p className="font-medium text-heading">
            {nextPaymentDue ?? '-'}
          </p>
        </div>

        <div>
          <p className="text-secondary">Mortgage End Date</p>
          <p className="font-medium text-heading">
            {mortgageEndDate}
          </p>
        </div>
      </div>

      {/* CTA */}
      {!isClosed && onMakePayment && (
        <button
          onClick={onMakePayment}
          className="mt-6 w-full rounded-lg border border-border py-2 text-sm font-medium hover:bg-hover"
        >
          Make Payment
        </button>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: MortgageStatProps) {
  return (
    <div className="flex justify-between border-b pb-2 last:border-b-0">
      <span className="text-secondary">{label}</span>
      <span
        className={cn(
          'font-medium',
          highlight ? 'text-primary' : 'text-heading'
        )}
      >
        {value}
      </span>
    </div>
  );
}
