export const preApprovalReceivedBody = ({userName, referenceNumber}: {
  userName: string;
  referenceNumber: string;
}) => {
  return `
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0;">
      Your Pre-approval Application Has Been Received!
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
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Step 3: Identity and Income Verification</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Verify both you immigration and home identity</p>
        </div>
      </div>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/applications/" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        View Application Status
      </a>
    </div>
  `;
};

export const preApprovalAcceptedBody = ({userName, referenceNumber}: {
  userName: string;
  referenceNumber: string;
}) => {
  return `
    <h2 style="color: #10b981; font-size: 24px; margin: 0 0 10px 0;">
      Congratulations! Your Pre-approval is Approved!
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Great news! After reviewing your application, we're pleased to inform you that you've been pre-approved for a mortgage with Kletch.
    </p>

    <!-- Approval Details Box -->
    <div style="background-color: #f0fdf4; border: 2px solid #10b981; padding: 25px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #166534; margin: 0 0 20px 0; font-size: 18px;">
        Your Pre-approval Details
      </h3>
      
      <div style="margin-bottom: 15px;">
        <span style="color: #6b7280; font-size: 14px;">Reference Number:</span>
        <span style="color: #1f2937; font-size: 14px; font-weight: 600; margin-left: 10px;">${referenceNumber}</span>
      </div>
      
      <div style="background-color: #fef3c7; padding: 10px; border-radius: 6px; margin-top: 20px;">
        <span style="color: #92400e; font-size: 14px;">⏱️ Valid For:</span>
        <span style="color: #92400e; font-size: 14px; font-weight: 600; margin-left: 10px;">3 months</span>
      </div>
    </div>

    <!-- Next Steps -->
    <div style="margin: 30px 0;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
        Ready to Find Your Dream Property?
      </h3>
      
      <div style="position: relative; padding-left: 30px;">

        <!-- Step 1 -->
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #e5e7eb; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Complete Identity Verification</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Verify your identity and income documentation</p>
        </div>

        <!-- Step 2 -->
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #10b981; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Browse Properties</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Explore our partner properties within your approved budget</p>
        </div>
       
        
        <!-- Step 3 -->
        <div>
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #e5e7eb; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Finalize Your Mortgage</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Select your property and complete the full application</p>
        </div>
      </div>
    </div>

    <!-- CTA Buttons -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/properties" 
         style="display: inline-block; padding: 12px 30px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 10px;">
        Browse Properties
      </a>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Go to Dashboard
      </a>
    </div>

    <!-- Important Notice -->
    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5;">
        <strong>Important:</strong> This pre-approval is subject to final verification of your income and identity documentation. 
        The actual loan amount and terms may vary based on the property selected and final underwriting.
      </p>
    </div>
  `;
};

export const preApprovalRejectedBody = ({
  userName,
  referenceNumber,
  rejectionReasons,
}: {
  userName: string;
  referenceNumber: string;
  rejectionReasons?: string[];
}) => {
  return `
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0;">
      Your Pre-approval Application Update
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Thank you for your mortgage pre-approval application. After careful review, we regret to inform you that we're unable to approve your application at this time.
    </p>

    <!-- Reference Box -->
    <div style="background-color: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px;">
        Reference Number
      </p>
      <p style="color: #1f2937; margin: 0; font-size: 18px; font-weight: bold; font-family: monospace;">
        ${referenceNumber}
      </p>
    </div>

    ${rejectionReasons && rejectionReasons.length > 0 ? `
    <!-- Reasons Section -->
    <div style="margin: 30px 0;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">
        Why wasn't my application approved?
      </h3>
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 15px 0;">
        Your application didn't meet our requirements in the following areas:
      </p>
      <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
        ${rejectionReasons.map(reason => `<li>${reason}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Next Steps -->
    <div style="margin: 30px 0;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
        What Can You Do Next?
      </h3>
      
      <div style="position: relative; padding-left: 30px;">
        <!-- Option 1 -->
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #3b82f6; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Review Rejection Reasons</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Review the rejection reason stated above, fix in your application and then submit again</p>
        </div>
        
        <!-- Option 2 -->
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #3b82f6; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Contact Our Support Team</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Our mortgage advisors can provide guidance on improving your application</p>
        </div>
        
      </div>
    </div>

    <!-- Support CTA -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/support" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Contact Support
      </a>
    </div>

  `;
};