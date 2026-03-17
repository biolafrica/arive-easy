import { EmailButton, StatusBadge } from "../components/EmailButton";
import { DataTable, InfoBox, Timeline } from "../components/EmailCard";

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
    ${StatusBadge('success', 'Identity Verification Successful!')}

    <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 10px 0; text-align: center;">
      Identity Verification Successful! 
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Great news! Your identity has been successfully verified. You've completed another important step in your mortgage application process.
    </p>

    ${DataTable([
      { label: 'Application ID', value: applicationId.substring(0, 8).toUpperCase() },
      { label: 'Verification Date', value: new Date(verificationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }) },
      { label: 'Status', value: 'VERIFIED', highlight: true }
    ], 'Verification Details')}


    <h3 style="color: #374151; font-size: 18px; margin: 30 0 20px 0;">
      Ready to Find Your Dream Property?
    </h3>

    ${Timeline([
      { title: 'Browse verified Properties', description: 'Explore available listings and review property details, documents, and virtual tours.', status: 'current'},
      { title: 'Select a Property', description: 'Choose the property you’re interested in and proceed with your application.', status: 'pending'},
      { title: 'Submit Application', description: 'Provide the required information so lenders or sellers can review your request.', status: 'pending'},
      { title: 'Review and sign documents', description: 'If your application moves forward, you will be guided through the next steps, including agreement review and secure electronic signing.', status: 'pending'}
    ])}

    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
      You can access your dashboard anytime to continue.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard/applications', 'Continue on Kletch')}
    </div>

    ${InfoBox(
      'Security Note',
      'Your identity verification data is encrypted and securely stored in compliance with data protection regulations.',
      'info'
    )}

  

  `;
};

export const identityVerificationDeclineBody = ({
  userName,
  referenceNumber,
  declineReasons,
  canResubmit,
  resubmitAfterDays,
}: {
  userName: string;
  referenceNumber: string;
  declineReasons: string;
  canResubmit: boolean;
  resubmitAfterDays?: number;
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

    ${StatusBadge('error', 'Additional Documentation Required', `Reference Number: ${referenceNumber}`)}

    ${InfoBox(
      'What needs to be addressed?',
      declineReasons,
      'error'
    )}
    
    <h3 style="color: #374151; font-size: 18px; margin: 0 0 20px 0;">
      How to Proceed
    </h3>

    ${Timeline([
      { title: 'Review your information', description: 'Review the reason above and ensure that your name and personal details match exactly with your government-issued identification.', status: 'current'},
      { title: 'Ensure document photo is clear', description: 'Use a valid government-issued ID and make sure the entire document is visible, well-lit, and not blurry.', status: 'pending' },
      { title: 'Complete the identity check again', description: ' Follow the verification prompts in your dashboard and ensure your face is clearly visible during the verification step..', status: 'pending' },
      { title: 'Try using a different device or browser', description: 'Sometimes verification works better on a mobile device with a good camera. If the issue continues, please contact our support team and we will assist you with the next steps.', status: 'pending' },
    ])}

    <div style="text-align: center; margin: 30px 0;">
      ${canResubmit 
        ? EmailButton('https://www.usekletch.com/user-dashboard/application', 'Update Documents', 'success')
        : ''
      }
      ${EmailButton('https://www.usekletch.com/support', 'Contact Support')}
    </div>

    ${InfoBox(
      'Document Guidelines',
      `
        <ul style="margin: 0; padding-left: 20px;">
          <li>Documents must be in color and high resolution</li>
          <li>All corners and edges must be visible</li>
          <li>Text must be clearly readable without blur</li>
          <li>Documents should not be expired</li>
          <li>For foreign documents, certified translations may be required</li>
        </ul>
      `,
      'info'
    )}
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
      We're here to help you through this process. Once your documents are verified, you'll be able to start browsing properties immediately. 
      Thank you for your patience and cooperation.
    </p>
  `;
};