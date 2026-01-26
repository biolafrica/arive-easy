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
      You have received a new offer for your property <strong>${propertyName}</strong> through the Ariveasy platform.
    </p>

    <!-- Offer Summary -->
    <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; border-radius: 8px; text-align: center; margin: 25px 0;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin-bottom: 15px;">
        <span style="color: white; font-size: 36px;">💰</span>
      </div>
      <h3 style="color: white; margin: 0 0 10px 0; font-size: 20px;">
        Offer Amount
      </h3>
      <p style="color: white; margin: 0 0 15px 0; font-size: 32px; font-weight: bold;">
        ${offerAmount}
      </p>
      <div style="background-color: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px; display: inline-block;">
        <span style="color: white; font-size: 12px;">${propertyName}</span>
      </div>
    </div>


    <!-- Offer Details -->
    <div style="background-color: #f9fafb; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0; font-weight: 600;">
        Offer Details
      </h3>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Property:</td>
          <td style="padding: 12px 0; color: #1f2937; font-size: 14px; text-align: right; font-weight: 600;">
            ${propertyName}
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Property ID:</td>
          <td style="padding: 12px 0; color: #1f2937; font-size: 14px; text-align: right; font-family: monospace;">
            ${propertyId}
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Offer Amount:</td>
          <td style="padding: 12px 0; color: #10b981; font-size: 16px; text-align: right; font-weight: bold;">
            ${offerAmount}
          </td>
        </tr>

      </table>
    </div>


    <!-- CTA Buttons -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/seller-dashboard/offers" 
         style="display: inline-block; padding: 15px 35px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin-right: 15px;">
        📋 Review Offer
      </a>

    </div>

    <!-- Contact Support -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
      <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">
        Need Assistance?
      </h4>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
        Our team is available to help you evaluate this offer and guide you through the decision process.
      </p>
      <a href="mailto:seller-support@ariveasy.com" 
         style="color: #4F46E5; text-decoration: none; font-weight: 600;">
        Contact Seller Support
      </a>
    </div>
  `;
};