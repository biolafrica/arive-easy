import { AmountDisplay, EmailButton } from "../components/EmailButton";
import { DataTable, InfoBox } from "../components/EmailCard";

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

  const getNextStepsContent = (paymentType: string) => {
    switch (paymentType) {
      case 'Application Processing':
        return `
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Kindly go back to your dashboard for your Immigration and Home country Identity Verification</li>
            <li style="margin-bottom: 5px;">You'll receive an update within 24-48 hours</li>
            <li>Once successful, you can start browsing properties</li>
          </ul>
        `;
      case 'Escrow':
        return `
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Our team and the seller will confirm receipt of your payment.</li>
            <li style="margin-bottom: 5px;">You will receive a separate email with a link to complete the bank’s mortgage application form. Please complete this form promptly so the financing review can proceed.</li>
            <li style="margin-bottom: 5px;">The bank will request a property valuation as part of its review process. You will receive an email with instructions to make the required valuation payment.</li>
            <li style="margin-bottom: 5px;">Once the valuation step is completed, the necessary agreements and supporting documents will be prepared for review and signing. If you wish, you may seek legal advice from Kletch partner lawyers to review the documents before signing.</li>
          </ul>
        `;
      case 'Valuation':
        return `
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Wait for a detailed email about the apartment valuation from our support team</li>
            <li style="margin-bottom: 5px;">You'll receive an update within 5 working days</li>
            <li>After valuation, you can sign the necessary documents and activate your mortgage</li>
          </ul>
        `;
      case 'Legal':
        return `
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Wait for a detailed email about the apartment remaining documents from our support team</li>
            <li style="margin-bottom: 5px;">You'll receive an update within 5 working days</li>
            <li>After legal stage, we activate your mortgage</li>
          </ul>
        `;
      default:
        return `
          <ul style="margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 5px;">Wait for a detailed email about the apartment from our support team</li>
          </ul>
        `;
    }
  };

  return `
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0;">
      Payment Receipt
    </h2>

    <p style="color: #4b5563; font-size: 16px; margin: 0 0 30px 0;">
      Thank you for your payment, ${userName}!
    </p>

    ${AmountDisplay(formattedAmount, 'Total Amount Paid')}

    ${DataTable([
      { label: 'Transaction ID', value: `${transactionId.substring(0, 8).toUpperCase()}...` },
      { label: 'Application ID', value: `${applicationId.substring(0, 8).toUpperCase()}...` },
      { label: 'Payment Date', value: new Date(paymentDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) },
      { label: 'Description', value: `${type} Fee` }
    ], 'Transaction Details')}

    ${receiptUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        ${EmailButton(receiptUrl, 'Download Official Receipt')}
        <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
          Keep this receipt for your records
        </p>
      </div>
    ` : ''}

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

    ${InfoBox(
      'What happens next?',
      getNextStepsContent(type),
      'warning'
    )}


    <h3 style="color: #374151; font-size: 18px; margin: 30px 0 20px 0;">
      You can monitor your transaction progress at any time from your dashboard.
    </h3>
  `;
};

export const generalPaymentReceipt =({userName, receiptUrl}:{userName:string, receiptUrl:string})=>{
  return`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4F46E5;">Your Receipt is Ready!</h2>
      <p>Dear ${userName || 'Customer'},</p>
      <p>Your official receipt is now available.</p>
      <div style="margin: 30px 0;">
        <a href="${receiptUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Download Receipt PDF
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">This receipt serves as your official payment confirmation.</p>
    </div>
  `
}
