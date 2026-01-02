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
      Identity Verification Successful! 🎉
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
        What Happens Next?
      </h3>
      
      <div style="border-left: 3px solid #4F46E5; padding-left: 20px; margin-bottom: 15px;">
        <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">
          Application Review
        </h4>
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          Our underwriting team is now reviewing your complete application. This typically takes 2-3 business days.
        </p>
      </div>
      
      <div style="border-left: 3px solid #e5e7eb; padding-left: 20px; margin-bottom: 15px;">
        <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">
          Final Decision
        </h4>
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          You'll receive an email with your mortgage approval decision and next steps.
        </p>
      </div>
      
      <div style="border-left: 3px solid #e5e7eb; padding-left: 20px;">
        <h4 style="color: #1f2937; margin: 0 0 5px 0; font-size: 16px;">
          Property Selection
        </h4>
        <p style="color: #6b7280; margin: 0; font-size: 14px;">
          Once approved, you can browse and select properties within your approved range.
        </p>
      </div>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/applications/${applicationId}" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        View Application Status
      </a>
    </div>

    <!-- Security Note -->
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 25px;">
      <p style="color: #6b7280; margin: 0; font-size: 13px; text-align: center;">
        🔒 Your identity verification data is encrypted and securely stored in compliance with data protection regulations.
      </p>
    </div>
  `;
};

export const identityVerificationFailedBody = ({
  userName,
  applicationId,
  failureReason,
  attemptNumber,
  maxAttempts = 3,
}: {
  userName: string;
  applicationId: string;
  failureReason?: string;
  attemptNumber: number;
  maxAttempts?: number;
}) => {
  const attemptsRemaining = maxAttempts - attemptNumber;
  
  return `
    <!-- Warning Badge -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 50%; position: relative;">
        <svg style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0; text-align: center;">
      Identity Verification Unsuccessful
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Unfortunately, we were unable to verify your identity at this time. This can happen for various reasons, and we're here to help you complete this step successfully.
    </p>

    <!-- Failure Details Box -->
    <div style="background-color: #fef2f2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #991b1b; margin: 0 0 15px 0; font-size: 16px;">
        Verification Details
      </h3>
      <table style="width: 100%;">
        <tr>
          <td style="padding: 5px 0; color: #991b1b; font-size: 14px;">Application ID:</td>
          <td style="padding: 5px 0; color: #991b1b; font-size: 14px; text-align: right; font-family: monospace;">
            ${applicationId.substring(0, 8).toUpperCase()}
          </td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #991b1b; font-size: 14px;">Attempt:</td>
          <td style="padding: 5px 0; color: #991b1b; font-size: 14px; text-align: right;">
            ${attemptNumber} of ${maxAttempts}
          </td>
        </tr>
        ${attemptsRemaining > 0 ? `
        <tr>
          <td style="padding: 5px 0; color: #991b1b; font-size: 14px;">Attempts Remaining:</td>
          <td style="padding: 5px 0; color: #991b1b; font-size: 14px; text-align: right;">
            <strong>${attemptsRemaining}</strong>
          </td>
        </tr>
        ` : ''}
      </table>
    </div>

    <!-- Common Reasons -->
    <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 4px;">
      <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px;">
        Common Reasons for Verification Issues:
      </h3>
      <ul style="color: #92400e; margin: 10px 0; padding-left: 20px; font-size: 14px;">
        <li style="margin-bottom: 8px;">
          <strong>Photo Quality:</strong> Ensure your ID photo is clear, well-lit, and all text is readable
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Document Validity:</strong> Make sure your ID is not expired and is an accepted form of identification
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Information Mismatch:</strong> Verify that the information on your ID matches what you provided in your application
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Selfie Issues:</strong> Ensure your face is clearly visible and matches your ID photo
        </li>
      </ul>
    </div>

    ${attemptsRemaining > 0 ? `
    <!-- Retry Instructions -->
    <div style="margin: 30px 0;">
      <h3 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">
        How to Retry Verification:
      </h3>
      
      <ol style="color: #4b5563; margin: 10px 0; padding-left: 25px; font-size: 14px; line-height: 1.8;">
        <li>Log in to your Ariveasy dashboard</li>
        <li>Navigate to your application</li>
        <li>Click the "Retry Verification" button</li>
        <li>Follow the on-screen instructions carefully</li>
        <li>Ensure good lighting and clear photos</li>
      </ol>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/applications/${applicationId}" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Retry Verification
      </a>
    </div>
    ` : `
    <!-- No Attempts Remaining -->
    <div style="background-color: #fef2f2; border: 1px solid #ef4444; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <h3 style="color: #991b1b; margin: 0 0 10px 0; font-size: 16px;">
        Maximum Attempts Reached
      </h3>
      <p style="color: #991b1b; margin: 0; font-size: 14px;">
        You've reached the maximum number of verification attempts. Please contact our support team for assistance.
      </p>
    </div>

    <!-- Contact Support -->
    <div style="text-align: center; margin: 30px 0;">
      <p style="color: #4b5563; margin: 0 0 15px 0; font-size: 14px;">
        Our support team is ready to help you complete your verification:
      </p>
      <a href="mailto:support@ariveasy.com?subject=Identity Verification Help - ${applicationId}" 
         style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Contact Support
      </a>
    </div>
    `}

    <!-- Support Information -->
    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin-top: 25px;">
      <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px; text-align: center;">
        <strong>Need immediate assistance?</strong>
      </p>
      <p style="color: #6b7280; margin: 0; font-size: 14px; text-align: center;">
        Email: support@ariveasy.com<br>
        Reference: ${applicationId}
      </p>
    </div>
  `;
};