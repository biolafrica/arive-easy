export const preApprovalReceivedBody = ({
  userName,
  referenceNumber,
}: {
  userName: string;
  referenceNumber: string;
}) => {
  return `
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0;">
      Your Pre-approval Application Has Been Received! 🎉
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      We've successfully received your mortgage pre-approval application. Our team is now reviewing your information.
    </p>

    <!-- Reference Number Box -->
    <div style="background-color: #ede9fe; border: 2px solid #8b5cf6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
      <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">
        Your Reference Number
      </p>
      <p style="color: #8b5cf6; margin: 0; font-size: 24px; font-weight: bold; font-family: monospace;">
        ${referenceNumber}
      </p>
      <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">
        Please keep this for your records
      </p>
    </div>

    <!-- Timeline -->
    <div style="margin: 30px 0;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
        What Happens Next?
      </h3>
      
      <div style="position: relative; padding-left: 30px;">
        <!-- Step 1 -->
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #10b981; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Step 1: Application Review</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Our team reviews your application (24-48 hours)</p>
        </div>
        
        <!-- Step 2 -->
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #e5e7eb; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Step 2: Pre-approval Decision</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">You'll receive your pre-approval decision via email</p>
        </div>
        
        <!-- Step 3 -->
        <div>
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #e5e7eb; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Step 3: Property Selection</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Browse and select properties within your approved range</p>
        </div>
      </div>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        View Application Status
      </a>
    </div>
  `;
};