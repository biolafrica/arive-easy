import { AmountDisplay, EmailButton } from "../components/EmailButton";
import { DataTable, InfoBox } from "../components/EmailCard";

export const offerNotificationBody = ({
  sellerName,
  propertyName,
  propertyId,
  offerAmount,
}: {
  sellerName: string;
  propertyName: string;
  propertyId: string;
  offerAmount: string;

}) => {
  return `
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0;">
      New Property Offer Received
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${sellerName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      You have received a new offer for your property <strong>${propertyName}</strong> through the Kletch platform.
    </p>

    ${AmountDisplay(offerAmount, 'Offer Amount', false)}

    ${DataTable([
      { label: 'Property', value: propertyName },
      { label: 'Property ID', value: propertyId },
      { label: 'Offer Amount', value: offerAmount, highlight: true }
    ], 'Offer Details')}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/seller-dashboard/offers', 'Review Offer', 'success')}
    </div>

    ${InfoBox(
      'Need Assistance?',
      'Our team is available to help you evaluate this offer and guide you through the decision process. <a href="mailto:support@usekletch.com" style="color: inherit; font-weight: 600;">Contact Seller Support</a>',
      'info'
    )}

  `;
};