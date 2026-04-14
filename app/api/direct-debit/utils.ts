export function calculateBillingCycleAnchor(
  firstPaymentDate: string | null,
  paymentDayOfMonth: number
): { billingCycleAnchor: number; trialEnd: number | undefined } {
  const now = new Date();

  // Find the nearest future date that falls on paymentDayOfMonth
  // This is always within ~30 days, which Stripe accepts
  const anchorDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    paymentDayOfMonth,
    0, 0, 0, 0
  );

  // If this month's day has already passed, move to next month
  if (anchorDate <= now) {
    anchorDate.setMonth(anchorDate.getMonth() + 1);
  }

  const billingCycleAnchor = Math.floor(anchorDate.getTime() / 1000);

  // If firstPaymentDate is provided and is AFTER the anchor,
  // we need trial_end to delay the first actual charge
  let trialEnd: number | undefined;

  if (firstPaymentDate) {
    const firstPayment = new Date(firstPaymentDate);
    // Normalize to midnight UTC to avoid time-of-day drift
    firstPayment.setHours(0, 0, 0, 0);
    const firstPaymentUnix = Math.floor(firstPayment.getTime() / 1000);

    if (firstPaymentUnix > billingCycleAnchor) {
      // First payment is in the future beyond the anchor —
      // put the subscription in trial until that date
      trialEnd = firstPaymentUnix;
    }
  }

  return { billingCycleAnchor, trialEnd };
}

export async function createPaymentSchedule(
  supabaseAdmin: any, 
  mortgage: any, 
  subscriptionId: string,
  numberOfPayments: number 
) {
  const payments = [];
  const startDate = new Date(mortgage.first_payment_date);
  
  for (let i = 0; i < numberOfPayments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    payments.push({
      mortgage_id: mortgage.id,
      application_id: mortgage.application_id,
      payment_number: i + 1,
      amount: mortgage.monthly_payment,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'scheduled',
      stripe_subscription_id: subscriptionId,
    });
  }

  console.log(`Created ${payments.length} payment entries. First: ${payments[0]?.due_date}, Last: ${payments[payments.length - 1]?.due_date}`);

  // Insert in batches of 50
  for (let i = 0; i < payments.length; i += 50) {
    const batch = payments.slice(i, i + 50);
    const { error } = await supabaseAdmin
      .from('mortgage_payments')
      .insert(batch);
    
    if (error) {
      console.error('Failed to create payment schedule batch:', error);
    }
  }

  console.log(`Successfully created payment schedule with ${payments.length} payments`);
}

// billing_cycle_anchor cannot be later than next natural billing data(1778433215) for plan