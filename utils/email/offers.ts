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

    <!-- Success Banner -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 8px; text-align: center; margin: 25px 0;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin-bottom: 15px;">
        <span style="color: white; font-size: 36px;">🏠</span>
      </div>
      <h3 style="color: white; margin: 0 0 10px 0; font-size: 20px;">
        Offer Accepted!
      </h3>
      <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">
        ${propertyName}
      </p>
      ${offerAmount ? `
        <div style="background-color: rgba(255,255,255,0.2); padding: 10px 20px; border-radius: 20px; display: inline-block; margin-top: 15px;">
          <span style="color: white; font-size: 16px; font-weight: 600;">${offerAmount}</span>
        </div>
      ` : ''}
    </div>

    <!-- Application Details -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
        Application Details
      </h3>
      
      <table style="width: 100%;">

        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Application Number:</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right; font-family: monospace;">
            ${applicationNumber}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Property:</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">
            ${propertyName}
          </td>
        </tr>

        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
          <td style="padding: 8px 0; color: #10b981; font-size: 14px; text-align: right; font-weight: 600;">
            Offer Accepted ✓
          </td>
        </tr>
      </table>
    </div>

    <!-- Next Steps Timeline -->
    <div style="margin: 30px 0;">

      <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
        What Happens Next?
      </h3>
      
      <div style="position: relative; padding-left: 30px;">
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #10b981; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Legal Documentation</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Our Banking Partner will review your application</p>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #10b981; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Legal Documentation</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Our legal team will prepare the purchase agreement and necessary documentation</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #e5e7eb; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Final Mortgage Processing</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Complete mortgage underwriting and final approval process</p>
        </div>
        
        <div>
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #e5e7eb; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Property Transfer</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Complete the property purchase and receive your ownership documents</p>
        </div>
      </div>

    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/applications/" 
         style="display: inline-block; padding: 15px 35px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        View Application Status
      </a>
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

    <!-- Status Box -->
    <div style="background-color: #fef2f2; border: 2px solid #ef4444; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; background-color: #ef4444; border-radius: 50%; margin-bottom: 15px;">
        <span style="color: white; font-size: 24px; font-weight: bold;">✕</span>
      </div>
      <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">
        Offer Not Accepted
      </h3>
      <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">
        ${propertyName}
      </p>
      ${offerAmount ? `
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          Offered Amount: ${offerAmount}
        </p>
      ` : ''}
    </div>

    <!-- Application Details -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
      <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
        Application Details
      </h3>
      
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Application Number:</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right; font-family: monospace;">
            ${applicationNumber}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Property:</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">
            ${propertyName}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
          <td style="padding: 8px 0; color: #ef4444; font-size: 14px; text-align: right; font-weight: 600;">
            Offer Declined
          </td>
        </tr>
      </table>
    </div>

    ${reason ? `
    <!-- Reason Section -->
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 4px;">
      <h4 style="color: #dc2626; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
        Seller's Feedback
      </h4>
      <p style="color: #dc2626; margin: 0; font-size: 14px; line-height: 1.6;">
        ${reason}
      </p>
    </div>
    ` : ''}

    <!-- Next Steps -->
    <div style="margin: 30px 0;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
        Your Options Moving Forward
      </h3>
      
      <div style="position: relative; padding-left: 30px;">
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #3b82f6; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Revise Your Offer</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Consider adjusting your offer terms based on seller feedback</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #10b981; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Explore Other Properties</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Browse our extensive collection of available properties</p>
        </div>
        
        <div>
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #8b5cf6; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Speak with Our Team</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Get personalized advice on your property search strategy</p>
        </div>
        
      </div>
    </div>

    <!-- CTA Buttons -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/properties" 
         style="display: inline-block; padding: 12px 30px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 15px;">
        Browse Properties
      </a>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Get Support
      </a>
    </div>

    <!-- Encouragement -->
    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin-top: 30px; border-radius: 4px;">
      <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
        💪 Don't Give Up!
      </h4>
      <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
        Property negotiations are a normal part of the home buying process. With your pre-approved mortgage, 
        you're in a strong position to find the perfect property. Our team is here to help you every step of the way.
      </p>
    </div>
  `;
};