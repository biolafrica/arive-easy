export const paymentReceiptBody = ({
  userName,
  amount,
  currency,
  transactionId,
  receiptUrl,
  paymentDate,
  applicationId,
  type
}: {
  userName: string;
  amount: number;
  currency: string;
  transactionId: string;
  receiptUrl?: string;
  applicationId: string;
  paymentDate: string;
  type:string
}) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

  return `
    <!-- Greeting -->
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0;">
      Payment Receipt
    </h2>
    <p style="color: #4b5563; font-size: 16px; margin: 0 0 30px 0;">
      Thank you for your payment, ${userName}!
    </p>

    <!-- Payment Summary Box -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 8px; margin-bottom: 30px;">
      <p style="color: white; margin: 0 0 10px 0; font-size: 14px; opacity: 0.95;">
        Total Amount Paid
      </p>
      <p style="color: white; margin: 0; font-size: 32px; font-weight: bold;">
        ${formattedAmount}
      </p>
    </div>

    <!-- Transaction Details -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
        Transaction Details
      </h3>
      
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Transaction ID:</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right; font-family: monospace;">
            ${transactionId.substring(0, 8).toUpperCase()}...
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Application ID:</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right; font-family: monospace;">
            ${applicationId.substring(0, 8).toUpperCase()}...
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Date:</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">
            ${new Date(paymentDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Description:</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">
            ${type} Fee
          </td>
        </tr>
      </table>
    </div>

    <!-- Receipt Download Button (if available) -->
    ${receiptUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${receiptUrl}" 
           style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
          Download Official Receipt
        </a>
        <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
          Keep this receipt for your records
        </p>
      </div>
    ` : ''}

    <!-- Next Steps -->
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 25px; border-radius: 4px;">
      <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
        What happens next?
      </h4>

      ${type === 'Application Processing' ? `

        <ul style="color: #92400e; margin: 10px 0; padding-left: 20px; font-size: 14px;">
          <li style="margin-bottom: 5px;">Kindly go back to your your dashboard for your Immigration and Home country Identity Verification</li>
          <li style="margin-bottom: 5px;">You'll receive an update within 24-48 hours</li>
          <li>Once Successfull, you can start browsing properties</li>
        </ul>` 

        : type === 'Escrow'? `<ul style="color: #92400e; margin: 10px 0; padding-left: 20px; font-size: 14px;">
          <li style="margin-bottom: 5px;">Wait for a detail email about the apartment valuation from our support team</li>
          <li style="margin-bottom: 5px;">You'll receive an update within 5 working days</li>
          <li>After valuation, you can sign the necessary document and activate your mortgage </li>
        </ul>`

        : type === 'Legal' ? `<ul style="color: #92400e; margin: 10px 0; padding-left: 20px; font-size: 14px;">
          <li style="margin-bottom: 5px;">Wait for a detail email about the apartment remaining documents from our support team</li>
          <li style="margin-bottom: 5px;">You'll receive an update within 5 working days</li>
          <li>After legal stage, we activate your mortgage </li>
        </ul>` 

        : type === "Valuation" ? `<ul style="color: #92400e; margin: 10px 0; padding-left: 20px; font-size: 14px;">
          <li style="margin-bottom: 5px;">Wait for a detail email about the apartment valuation from our support team</li>
          <li style="margin-bottom: 5px;">You'll receive an update within 5 working days</li>
          <li>After valuation, you can sign the necessary document and activate your mortgage </li>
        </ul>` 

        : ` <ul style="color: #92400e; margin: 10px 0; padding-left: 20px; font-size: 14px;">
          <li style="margin-bottom: 5px;">Wait for a detail email about the apartment from our support team</li>
        </ul>`
      }
    

    </div>
  `;
};
