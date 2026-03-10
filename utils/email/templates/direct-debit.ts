
import { formatDate, formatUSD } from '@/lib/formatter';
import { getOrdinalSuffix } from '../../common/ordinalSuffix';
import { AmountDisplay, EmailButton } from '../components/EmailButton';
import { DataTable, InfoBox } from '../components/EmailCard';

interface DirectDebitConfirmationParams {
  userName: string;
  monthlyPayment: number;
  firstPaymentDate: string;
  paymentDayOfMonth: number;
  paymentMethodDisplay: string;
  totalPayments: number;
  applicationNumber?: string;
}

interface PaymentFailedParams {
  userName: string;
  amount: number;
  failureReason: string;
  retryDate: string | null;
  applicationNumber?: string;
  updatePaymentUrl: string;
}

interface PaymentReminderParams {
  userName: string;
  amount: number;
  paymentDate: string;
  paymentNumber: number;
  totalPayments: number;
  paymentMethodDisplay: string;
}

interface PaymentSuccessParams {
  userName: string;
  amount: number;
  paymentNumber: number;
  totalPayments: number;
  numberOfPayments: number;
  nextPaymentDate: string;
  applicationNumber?: string;
  monthlyPayment: number;
}

export function getDirectDebitConfirmationEmailTemplate(params: DirectDebitConfirmationParams): string {
  const {
    userName,
    monthlyPayment,
    firstPaymentDate,
    paymentDayOfMonth,
    paymentMethodDisplay,
    totalPayments,
    applicationNumber,
  } = params;

  return `
    <h2 style="color: #10b981; font-size: 24px; margin: 0 0 10px 0;">
     Automatic Payment Set Up 
    </h2>
       
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>

    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Great news! Your automatic mortgage payments have been successfully set up. Your payments will be processed automatically each month.
    </p>

    ${AmountDisplay(formatUSD({ amount: monthlyPayment }), 'Monthly Payment')}

    ${DataTable([
      { label: 'Monthly Payment', value: formatUSD({ amount: totalPayments }), highlight: true },
      { label: 'Payment Day', value: `${paymentDayOfMonth}${getOrdinalSuffix( paymentDayOfMonth)} of each month` },
      { label: 'First Payment', value: formatDate(firstPaymentDate) },
      { label: 'Payment Method', value: paymentMethodDisplay },
      { label: 'Total Payments', value: `${totalPayments} months` },
      ...(applicationNumber ? [{ label: 'Reference', value: applicationNumber }] : [])
    ], 'Payment Details')}

    ${InfoBox(
      'What happens next?',
      `
        <ul style="margin: 0; padding-left: 20px;">
          <li>You'll receive a reminder 3 days before each payment</li>
          <li>Payments will be automatically deducted on the ${paymentDayOfMonth}${getOrdinalSuffix(paymentDayOfMonth)}</li>
          <li>You'll receive a receipt after each successful payment</li>
          <li>You can view your payment history anytime in your dashboard</li>
        </ul>
      `,
      'info'
    )}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard', 'View Your Dashboard')}
    </div>
  `;
}


export function getPaymentSuccessEmailTemplate(params: PaymentSuccessParams): string {
  const {
    userName,
    amount,
    paymentNumber,
    totalPayments,
    nextPaymentDate,
    applicationNumber,
    numberOfPayments,
    monthlyPayment
  } = params;

  const progressPercent = Math.round((paymentNumber / numberOfPayments) * 100);

  return `
    <h2 style="color: #10b981; font-size: 24px; margin: 0 0 10px 0;">
      Payment Successful
    </h2>
       
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Hi ${userName},
    </p>

    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Your mortgage payment has been successfully processed. Here are the details:
    </p>

    ${AmountDisplay(formatUSD({ amount, fromCents:true }), `Payment ${paymentNumber} of ${numberOfPayments}`)}

    <!-- Progress Indicator -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
        Mortgage Progress
      </h3>
      <p style="color: #374151; font-size: 14px; margin: 0 0 8px;">
        ${progressPercent}% complete
      </p>
      <div style="background-color: #e5e7eb; border-radius: 9999px; height: 8px; overflow: hidden;">
        <div style="background-color: #10b981; height: 100%; width: ${progressPercent}%; border-radius: 9999px;"></div>
      </div>
      <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
        ${numberOfPayments - paymentNumber} payments remaining
      </p>
    </div>

    ${DataTable([
      { label: 'Amount Paid', value: formatUSD({ amount, fromCents:true }), highlight: true },
      { label: 'Payment Number', value: `${paymentNumber} of ${numberOfPayments}` },
      { label: 'Next Payment', value: formatDate(nextPaymentDate) },
      ...(applicationNumber ? [{ label: 'Reference', value: applicationNumber }] : [])
    ], 'Payment Details')}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://usekletch.com/user-dashboard/payments', 'View Payment History', 'success')}
    </div>

  `;
}

export function getPaymentFailedEmailTemplate(params: PaymentFailedParams): string {
  const {
    userName,
    amount,
    failureReason,
    retryDate,
    applicationNumber,
    updatePaymentUrl,
  } = params;

  const formattedRetryDate = retryDate  ? formatDate(retryDate) : null;

  return `
    <h2 style="color: #10b981; font-size: 24px; margin: 0 0 10px 0;">
      Payment Failed
    </h2>
       
    <p style="color: color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Hi ${userName},
    </p>

    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      We were unable to process your mortgage payment. Please update your payment method to avoid any disruption to your mortgage.
    </p>

    ${DataTable([
      { label: 'Amount Due', value: formatUSD({ amount, fromCents:true }), highlight: true },
      { label: 'Failure Reason', value: failureReason },
      ...(formattedRetryDate ? [{ label: 'Next Retry', value: formattedRetryDate }] : []),
      ...(applicationNumber ? [{ label: 'Reference', value: applicationNumber }] : [])
    ], 'Payment Details')}

    ${InfoBox(
      'What you can do:',
      `  <ol style="margin: 0; padding-left: 20px;">
          <li>Check that your bank account has sufficient funds</li>
          <li>Verify your payment details are correct</li>
          <li>Update your payment method if needed</li>
          <li>Contact your bank if the issue persists</li>
        </ol>
      `,
      'error'
    )}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton(updatePaymentUrl, 'Update Payment Method', 'warning')}
    </div>

    <p style="color: #6b7280; font-size: 14px; margin: 30px 0 0; text-align: center;">
      Need help? Contact our support team at 
      <a href="mailto:support@usekletch.com" style="color: #4F46E5;">support@kletch.com</a>
    </p>
  `;
}

export function getPaymentReminderEmailTemplate(params: PaymentReminderParams): string {
  const {
    userName,
    amount,
    paymentDate,
    paymentNumber,
    totalPayments,
    paymentMethodDisplay,
  } = params;

  return `

    <h2 style="color: #7c3aed; font-size: 24px; margin: 0 0 10px 0;">
      Payment Reminder
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Hi ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      This is a friendly reminder that your mortgage payment is coming up in 3 days.
    </p>

    <div style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 25px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
      <p style="color: white; margin: 0 0 10px 0; font-size: 14px; opacity: 0.95;">
        Payment Amount
      </p>
      <p style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">
        ${formatUSD({ amount })}
      </p>
      <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">
        Due ${formatDate(paymentDate)}
      </p>
    </div>

    ${DataTable([
      { label: 'Amount', value: formatUSD({ amount }), highlight: true },
      { label: 'Payment Date', value: formatDate(paymentDate) },
      { label: 'Payment Method', value: paymentMethodDisplay },
      { label: 'Payment', value: `${paymentNumber} of ${totalPayments}` }
    ], 'Payment Details')}

    ${InfoBox(
      'No Action Required',
      'Please ensure sufficient funds are available in your account. No action is required if your payment details are up to date.',
      'info'
    )}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard', 'View Dashboard')}
    </div>

  `;
}