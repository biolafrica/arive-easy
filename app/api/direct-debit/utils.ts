export function calculateBillingCycleAnchor(firstPaymentDate: string | null, paymentDayOfMonth: number): number {
  if (firstPaymentDate) {
    return Math.floor(new Date(firstPaymentDate).getTime() / 1000);
  }

  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth(), paymentDayOfMonth);
  
  if (targetDate <= now) {
    targetDate.setMonth(targetDate.getMonth() + 1);
  }

  return Math.floor(targetDate.getTime() / 1000);
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