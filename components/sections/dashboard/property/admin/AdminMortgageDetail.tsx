import { Mortgage } from "@/type/pages/dashboard/mortgage"
import { DescriptionList } from "@/components/common/DescriptionList"
import { formatDate, formatUSD } from "@/lib/formatter";
import { Accordion } from "@/components/common/Accordion";
import { useAdminMortgagePayment } from "@/hooks/useSpecialized/useMortgagePayment";
import { HeaderSkeleton } from "@/utils/common/skeleton";
import ErrorState from "@/components/feedbacks/ErrorState";
import { Badge } from "@/components/primitives/Badge";
import { getPaymentStatusBadge } from "@/lib/mortgageBadge";

const fallback = '--:--';

export default function AdminMortgageDetail({mortgage}:{
  mortgage:Mortgage
}){
  const{items, isLoading, pagination, error, refresh } = useAdminMortgagePayment({
    filters:{
      application_id: mortgage.application_id,
      mortgage_id: mortgage.id
    }
  }) 

  return(
     <div className="divide-y divide-border rounded-lg border border-border">

      <Accordion title="Mortgage Details" subtitle={`More info about ${mortgage.id}`} defaultOpen >
        <DescriptionList
          title={mortgage.id}
          subtitle={`More info About the mortgage`}
          items={[
            { label: 'Mortgage ID', value: { type: 'text', value: mortgage.id ?? fallback } },
            { label: 'Property Price', value: { type: 'text', value: formatUSD({ amount: mortgage.property_price, decimals: 2 }) || fallback } },
            { label: 'Down Payment', value: { type: 'text', value: formatUSD({ amount: mortgage.down_payment_made, decimals: 2 }) || fallback } },
            { label: 'Approved Loan Amount', value: { type: 'text', value: formatUSD({ amount: mortgage.approved_loan_amount, decimals: 2 }) || fallback } },
            { label: 'Interest Rate', value: { type: 'text', value: `${mortgage.interest_rate_annual}% annually` || fallback } },
            { label: 'Loan Term', value: { type: 'text', value: `${mortgage.loan_term_months} months` || fallback } },
            { label: 'Monthly Payment', value: { type: 'text', value: formatUSD({ amount: mortgage.monthly_payment, decimals: 2 }) || fallback } },
            { label: 'Total Payment', value: { type: 'text', value: formatUSD({ amount: mortgage.total_payments, decimals: 2 }) || fallback } },
            { label: 'First Payment Date', value: { type: 'text', value: formatDate(mortgage.first_payment_date) || fallback } },
            { label: 'Last Payment Date', value: { type: 'text', value: formatDate(mortgage.last_payment_date) || fallback } },
            { label: 'No of Payments Made', value: { type: 'text', value: `${mortgage.number_of_payments} payments` || fallback } },
            { label: 'Next Payment Date', value: { type: 'text', value: mortgage.next_payment_date ?? fallback } },
            { label: 'Status', value: { type: 'text', value: mortgage.status ?? fallback } },
            { label: 'Property ID', value: { type: 'text', value: mortgage.property_id ?? fallback } },
            { label: 'User ID', value: { type: 'text', value: mortgage.user_id ?? fallback } },
            { label: 'Application ID', value: { type: 'text', value: mortgage.application_id ?? fallback } },
          ]}
        />
      </Accordion>

      <Accordion title="Payment Method" subtitle="Stripe & payment method details">
        <DescriptionList
          title={mortgage.payment_method_display}
          subtitle="Payment method and Stripe details"
          items={[
            { label: 'Payment Method Type', value: { type: 'text', value: mortgage.payment_method_type ?? fallback } },
            { label: 'Payment Method', value: { type: 'text', value: mortgage.payment_method_display ?? fallback } },
            { label: 'Stripe Customer ID', value: { type: 'text', value: mortgage.stripe_customer_id ?? fallback } },
          ]}
        />
      </Accordion>

      <Accordion title="Payment History" subtitle="All mortgage payments made">
        {isLoading ? (
          <HeaderSkeleton/>
        ) : error ? (
          <ErrorState
            message="Failed to load payments."
            retryLabel="Reload payment"
            onRetry={refresh}
          />
        ) : items?.length ? (
          items.map((payment, index) => {
            const { variant, label } = getPaymentStatusBadge(payment.status);
            
            return(
              <DescriptionList
                key={payment.id ?? index}
                title={`Payment ${index + 1}`}
                subtitle={formatDate(payment.due_date) || fallback}
                items={[
                  { label: 'Amount', value: { type: 'text', value: formatUSD({ amount: payment.amount, decimals: 2 }) || fallback } },
                  {
                    label: 'Status',
                    value: {
                      type: 'custom',
                      node: (
                        <Badge variant={variant} dot size="sm">
                          {label}
                        </Badge>
                      )
                    }
                  },
                  { label: 'Payment Date', value: { type: 'text', value: formatDate(payment.due_date) || fallback } },
                  { label: 'Reference', value: { type: 'text', value: payment.stripe_subscription_id ?? fallback } },
                ]}
              />
            )
          })
        ) : (
          <p className="text-sm text-secondary py-2">No payments found.</p>
        )}
      </Accordion>

    </div>
  )
}