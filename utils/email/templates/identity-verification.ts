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
      { title: 'Browse Partner Properties', description: 'Explore verified properties from our trusted developer partners within your budget', status: 'current'},
      { title: 'Select Your Property', description: 'Choose your ideal property and submit your final mortgage application', status: 'pending'},
      { title: 'Down Payment',description: 'Make a down payment for the property', status: 'pending'}
    ])}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard/applications', 'View Application Status')}
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
      { title: 'Gather Required Documents', description: 'Ensure all documents are clear, legible, and meet our requirements', status: 'current'},
      { title: 'Upload Through Dashboard', description: 'Submit your updated documents via your secure dashboard', status: 'pending' },
      { title: canResubmit ? 'Get Verified' : 'Contact Support',
        description: canResubmit 
          ? (resubmitAfterDays 
            ? `You can resubmit after ${resubmitAfterDays} days. Our team will review within 24-48 hours.`
            : 'Our team will review your updated documents within 24-48 hours.')
          : 'Speak with our verification team for personalized guidance',
        status: 'pending'
      }
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