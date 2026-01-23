export const identityVerificationSuccessBody = ({
  userName,
  applicationId,
  verificationDate,
}: {
  userName: string;
  applicationId: string;
  verificationDate: string;
}) => {
  return `
    <!-- Success Badge -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; position: relative;">
        <svg style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0; text-align: center;">
      Identity Verification Successful! 
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Great news! Your identity has been successfully verified. You've completed another important step in your mortgage application process.
    </p>

    <!-- Verification Details Box -->
    <div style="background-color: #f0fdf4; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 16px;">
        Verification Details
      </h3>
      <table style="width: 100%;">
        <tr>
          <td style="padding: 5px 0; color: #166534; font-size: 14px;">Application ID:</td>
          <td style="padding: 5px 0; color: #166534; font-size: 14px; text-align: right; font-family: monospace;">
            ${applicationId.substring(0, 8).toUpperCase()}
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #166534; font-size: 14px;">Verification Date:</td>
          <td style="padding: 5px 0; color: #166534; font-size: 14px; text-align: right;">
            ${new Date(verificationDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #166534; font-size: 14px;">Status:</td>
          <td style="padding: 5px 0; color: #166534; font-size: 14px; text-align: right;">
            <span style="background-color: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
              VERIFIED
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Next Steps -->
    <div style="margin: 30px 0;">
        <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
          Ready to Find Your Dream Property?
        </h3>
        
        <div style="position: relative; padding-left: 30px;">
          <!-- Step 1 -->
          <div style="margin-bottom: 25px;">
            <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #10b981; border-radius: 50%;"></div>
            <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Browse Partner Properties</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Explore verified properties from our trusted developer partners within your budget</p>
          </div>
          
          <!-- Step 2 -->
          <div style="margin-bottom: 25px;">
            <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #e5e7eb; border-radius: 50%;"></div>
            <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Select Your Property</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Choose your ideal property and submit your final mortgage application</p>
          </div>
          
          <!-- Step 3 -->
          <div>
            <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #e5e7eb; border-radius: 50%;"></div>
            <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Finalize Your Mortgage</h4>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">Complete legal documentation and secure your property</p>
          </div>
        </div>
      </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/applications" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        View Application Status
      </a>
    </div>

    <!-- Security Note -->
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 25px;">
      <p style="color: #6b7280; margin: 0; font-size: 13px; text-align: center;">
        Your identity verification data is encrypted and securely stored in compliance with data protection regulations.
      </p>
    </div>
  `;
};

export const identityVerificationDeclineBody = ({
  userName,
  referenceNumber,
  declineReasons,
  canResubmit,
  resubmitAfterDays,
  supportDocuments,
}: {
  userName: string;
  referenceNumber: string;
  declineReasons: string;
  canResubmit: boolean;
  resubmitAfterDays?: number;
  supportDocuments?: string[];
}) => {
  return `
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0;">
      Identity Verification Update Required
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      We've reviewed your identity verification documents and need additional information to proceed with your mortgage application.
    </p>

    <!-- Status Box -->
    <div style="background-color: #fef2f2; border: 2px solid #ef4444; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 60px; height: 60px; background-color: #ef4444; border-radius: 50%; margin-bottom: 15px;">
        <span style="color: white; font-size: 24px; font-weight: bold;">!</span>
      </div>
      <h3 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px;">
        Additional Documentation Required
      </h3>
      <p style="color: #6b7280; margin: 0; font-size: 14px;">
        Reference Number: ${referenceNumber}
      </p>
    </div>

    <!-- Issues to Address -->
    <div style="margin: 30px 0;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">
        What needs to be addressed?
      </h3>
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px;">
      
        ${declineReasons}

      </div>
    </div>

    <!-- Action Steps -->
    <div style="margin: 30px 0;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
        How to Proceed
      </h3>
      
      <div style="position: relative; padding-left: 30px;">
        <!-- Step 1 -->
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #3b82f6; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Gather Required Documents</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Ensure all documents are clear, legible, and meet our requirements</p>
        </div>
        
        <!-- Step 2 -->
        <div style="margin-bottom: 25px;">
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #3b82f6; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Upload Through Dashboard</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Submit your updated documents via your secure dashboard</p>
        </div>
        
        ${canResubmit ? `
        <!-- Step 3 -->
        <div>
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #10b981; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Get Verified</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            ${resubmitAfterDays 
              ? `You can resubmit after ${resubmitAfterDays} days. Our team will review within 24-48 hours.` 
              : 'Our team will review your updated documents within 24-48 hours.'}
          </p>
        </div>
        ` : `
        <!-- Step 3 -->
        <div>
          <div style="position: absolute; left: 0; width: 20px; height: 20px; background-color: #f59e0b; border-radius: 50%;"></div>
          <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">Contact Support</h4>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">Speak with our verification team for personalized guidance</p>
        </div>
        `}
      </div>
    </div>

    <!-- CTA Buttons -->
    <div style="text-align: center; margin: 30px 0;">
      ${canResubmit ? `
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/user-dashboard/application" 
         style="display: inline-block; padding: 12px 30px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 15px;">
        Update Documents
      </a>
      ` : ''}
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Contact Support
      </a>
    </div>

    <!-- Document Requirements Help -->
    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">
        📋 Document Guidelines
      </h4>
      <ul style="color: #6b7280; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
        <li>Documents must be in color and high resolution</li>
        <li>All corners and edges must be visible</li>
        <li>Text must be clearly readable without blur</li>
        <li>Documents should not be expired</li>
        <li>For foreign documents, certified translations may be required</li>
      </ul>
    </div>

    <!-- Encouragement -->
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
      We're here to help you through this process. Once your documents are verified, you'll be able to start browsing properties immediately. 
      Thank you for your patience and cooperation.
    </p>
  `;
};