import { formatUSD, toNumber } from "@/lib/formatter";
import { EmailButton, StatusBadge } from "../components/EmailButton";
import { DataTable, InfoBox, Timeline } from "../components/EmailCard";

export const sendOfferAcceptedEmail = ({userName, propertyName, applicationNumber, offerAmount}: {
  userName: string;
  propertyName: string;
  applicationNumber: string;
  offerAmount?: string;
}) => {
  return `
    <h2 style="color: #10b981; font-size: 24px; margin: 0 0 10px 0;">
      Congratulations! Your Offer Has Been Accepted!
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Fantastic news! The seller has accepted your offer for <strong>${propertyName}</strong>. 
      You're one step closer to securing your dream property!
    </p>

    ${StatusBadge('success', 'Offer Accepted!', propertyName)}

    ${DataTable([
      { label: 'Application Number', value: applicationNumber },
      { label: 'Property', value: propertyName },
      { label: 'Status', value: 'Offer Accepted', highlight: true },
      ...(offerAmount ? [{ label: 'Offer Amount', value: formatUSD({amount:toNumber(offerAmount)}) , highlight: true }] : [])
    ], 'Application Details')}

    <h3 style="color: #374151; font-size: 18px; margin: 30px 0 20px 0;">
      What Happens Next?
    </h3>

    ${Timeline([
      { title: 'Down Payment',description: 'Make a down payment for the property', status: 'pending'},
      { title: 'Banking Partner Review', description: 'Our Banking Partner will review your application', status: 'current' },
      { title: 'Bank Underwritting', description: 'Review and sign necessary documents', status: 'pending'},
      { title: 'Property Valuation', description: 'The bank and our Team with value the Property', status: 'pending'},
    ])}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard/applications/', 'View Application Status', 'success')}
    </div>
  `;
};

export const sendOfferDeclinedEmail = ({
  userName,
  propertyName,
  applicationNumber,
  reason,
  offerAmount,
}: {
  userName: string;
  propertyName: string;
  applicationNumber: string;
  reason?: string;
  offerAmount?: string;
}) => {
  return `
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0;">
      Your Property Offer Update
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Thank you for your interest in <strong>${propertyName}</strong>. Unfortunately, the seller has decided not to accept your current offer.
    </p>

    ${StatusBadge('error', 'Offer Not Accepted', propertyName)}

    ${DataTable([
      { label: 'Application Number', value: applicationNumber },
      { label: 'Property', value: propertyName },
      { label: 'Status', value: 'Offer Declined' },
      ...(offerAmount ? [{ label: 'Offered Amount', value: formatUSD({amount:toNumber(offerAmount)}) }] : [])
    ], 'Application Details')}

    ${reason ? InfoBox('Seller\'s Feedback', reason, 'error') : ''}


    <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
      Your Options Moving Forward
    </h3>

    ${Timeline([
      { title: 'Explore Other Properties', description: 'Browse and select from our other extensive collection of available properties', status: 'current'},
      { title: 'Speak with Our Team', description: 'Get personalized advice on your property search strategy', status: 'pending'}
    ])}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard/properties', 'Browse Properties', 'success')}
      ${EmailButton('https://www.usekletch.com/support', 'Get Support')}
    </div>

  `;
};