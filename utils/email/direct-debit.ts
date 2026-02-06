
import { formatUSD } from '@/lib/formatter';

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
  nextPaymentDate: string;
  applicationNumber?: string;
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

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formattedDate = new Date(firstPaymentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Automatic Payments Set Up</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    ✓ Automatic Payments Set Up
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">
                    Hi ${userName},
                  </p>
                  
                  <p style="font-size: 16px; color: #374151; margin: 0 0 30px;">
                    Great news! Your automatic mortgage payments have been successfully set up. Your payments will be processed automatically each month.
                  </p>
                  
                  <!-- Payment Summary Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; border-radius: 8px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 24px;">
                        <h2 style="color: #1e40af; margin: 0 0 20px; font-size: 18px;">
                          Payment Details
                        </h2>
                        
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Monthly Payment</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 16px; font-weight: 600; text-align: right;">
                              ${formatUSD({ amount: monthlyPayment })}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Day</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${paymentDayOfMonth}${getOrdinalSuffix(paymentDayOfMonth)} of each month
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">First Payment</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${formattedDate}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Method</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${paymentMethodDisplay}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Total Payments</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${totalPayments} months
                            </td>
                          </tr>
                          ${applicationNumber ? `
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Reference</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${applicationNumber}
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- What's Next -->
                  <h3 style="color: #111827; margin: 0 0 16px; font-size: 16px;">
                    What happens next?
                  </h3>
                  <ul style="color: #374151; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0 0 30px;">
                    <li>You'll receive a reminder 3 days before each payment</li>
                    <li>Payments will be automatically deducted on the ${paymentDayOfMonth}${getOrdinalSuffix(paymentDayOfMonth)}</li>
                    <li>You'll receive a receipt after each successful payment</li>
                    <li>You can view your payment history anytime in your dashboard</li>
                  </ul>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 20px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/user-dashboard" 
                           style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          View Your Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
                    If you have any questions, please contact us at 
                    <a href="mailto:support@ariveasy.com" style="color: #2563eb;">support@ariveasy.com</a>
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0; text-align: center;">
                    © ${new Date().getFullYear()} Ariveasy. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
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
  } = params;

  const formattedNextDate = new Date(nextPaymentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const remainingPayments = totalPayments - paymentNumber;
  const progressPercent = Math.round((paymentNumber / totalPayments) * 100);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Successful</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    ✓ Payment Successful
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">
                    Hi ${userName},
                  </p>
                  
                  <p style="font-size: 16px; color: #374151; margin: 0 0 30px;">
                    Your mortgage payment has been successfully processed. Here are the details:
                  </p>
                  
                  <!-- Payment Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ecfdf5; border-radius: 8px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 24px; text-align: center;">
                        <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Amount Paid</p>
                        <p style="color: #059669; font-size: 32px; font-weight: 700; margin: 0;">
                          ${formatUSD({ amount })}
                        </p>
                        <p style="color: #6b7280; font-size: 14px; margin: 16px 0 0;">
                          Payment ${paymentNumber} of ${totalPayments}
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Progress Bar -->
                  <div style="margin-bottom: 30px;">
                    <p style="color: #374151; font-size: 14px; margin: 0 0 8px;">
                      Mortgage Progress: ${progressPercent}% complete
                    </p>
                    <div style="background-color: #e5e7eb; border-radius: 9999px; height: 8px; overflow: hidden;">
                      <div style="background-color: #059669; height: 100%; width: ${progressPercent}%; border-radius: 9999px;"></div>
                    </div>
                    <p style="color: #6b7280; font-size: 12px; margin: 8px 0 0;">
                      ${remainingPayments} payments remaining
                    </p>
                  </div>
                  
                  <!-- Next Payment Info -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 16px 24px;">
                        <p style="color: #6b7280; font-size: 14px; margin: 0;">Next Payment</p>
                        <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 4px 0 0;">
                          ${formattedNextDate}
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  ${applicationNumber ? `
                  <p style="color: #6b7280; font-size: 12px; margin: 0 0 20px;">
                    Reference: ${applicationNumber}
                  </p>
                  ` : ''}
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 10px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                           style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          View Payment History
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
                    If you have any questions, please contact us at 
                    <a href="mailto:support@ariveasy.com" style="color: #2563eb;">support@ariveasy.com</a>
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0; text-align: center;">
                    © ${new Date().getFullYear()} Ariveasy. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
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

  const formattedRetryDate = retryDate 
    ? new Date(retryDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed - Action Required</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    ⚠ Payment Failed
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">
                    Hi ${userName},
                  </p>
                  
                  <p style="font-size: 16px; color: #374151; margin: 0 0 30px;">
                    We were unable to process your mortgage payment. Please update your payment method to avoid any disruption to your mortgage.
                  </p>
                  
                  <!-- Payment Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef2f2; border-radius: 8px; margin-bottom: 30px; border: 1px solid #fecaca;">
                    <tr>
                      <td style="padding: 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount Due</td>
                            <td style="padding: 8px 0; color: #dc2626; font-size: 18px; font-weight: 600; text-align: right;">
                              ${formatUSD({ amount })}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Reason</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${failureReason}
                            </td>
                          </tr>
                          ${formattedRetryDate ? `
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Next Retry</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${formattedRetryDate}
                            </td>
                          </tr>
                          ` : ''}
                          ${applicationNumber ? `
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Reference</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${applicationNumber}
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- What to do -->
                  <h3 style="color: #111827; margin: 0 0 16px; font-size: 16px;">
                    What you can do:
                  </h3>
                  <ol style="color: #374151; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0 0 30px;">
                    <li>Check that your bank account has sufficient funds</li>
                    <li>Verify your payment details are correct</li>
                    <li>Update your payment method if needed</li>
                    <li>Contact your bank if the issue persists</li>
                  </ol>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 10px 0;">
                        <a href="${updatePaymentUrl}" 
                           style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          Update Payment Method
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #6b7280; font-size: 14px; margin: 30px 0 0; text-align: center;">
                    Need help? Contact our support team at 
                    <a href="mailto:support@ariveasy.com" style="color: #2563eb;">support@ariveasy.com</a>
                  </p>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                    © ${new Date().getFullYear()} Ariveasy. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
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

  const formattedDate = new Date(paymentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Reminder</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); padding: 40px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                    📅 Payment Reminder
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 20px;">
                    Hi ${userName},
                  </p>
                  
                  <p style="font-size: 16px; color: #374151; margin: 0 0 30px;">
                    This is a friendly reminder that your mortgage payment is coming up in 3 days.
                  </p>
                  
                  <!-- Payment Details -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f3ff; border-radius: 8px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount</td>
                            <td style="padding: 8px 0; color: #7c3aed; font-size: 18px; font-weight: 600; text-align: right;">
                              ${formatUSD({ amount })}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Date</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${formattedDate}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Method</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${paymentMethodDisplay}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment</td>
                            <td style="padding: 8px 0; color: #111827; font-size: 14px; text-align: right;">
                              ${paymentNumber} of ${totalPayments}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 30px;">
                    Please ensure sufficient funds are available in your account. No action is required if your payment details are up to date.
                  </p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 10px 0;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                           style="display: inline-block; background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                          View Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
                    If you have any questions, please contact us at 
                    <a href="mailto:support@ariveasy.com" style="color: #2563eb;">support@ariveasy.com</a>
                  </p>
                  <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0; text-align: center;">
                    © ${new Date().getFullYear()} Ariveasy. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}