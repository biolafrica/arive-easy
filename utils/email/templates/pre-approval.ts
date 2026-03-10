import { EmailButton, StatusBadge } from "../components/EmailButton";
import { DataTable, InfoBox, Timeline } from "../components/EmailCard";

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

    ${StatusBadge('info', 'Application Received', `Reference Number: ${referenceNumber}`)}
    
    <h3 style="color: #374151; font-size: 18px; margin: 30px 0 20px 0;">
      What Happens Next?
    </h3>
      
    ${Timeline([
      {title: 'Step 1: Application Review', description: 'Our team reviews your application (24-48 hours)', status: 'current'},
      {title: 'Step 2: Pre-approval Decision', description: "You'll receive your pre-approval decision via email", status: 'pending'},
      {title: 'Step 3: Identity and Income Verification', description: 'Verify both your immigration and home identity', status: 'pending'}
    ])}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard/applications/', 'View Application Status')}
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

    ${StatusBadge('success', 'Pre-approval Approved!')}

    ${DataTable([
      { label: 'Reference Number', value: referenceNumber },
      { label: 'Valid For', value: '3 months', highlight: true }
    ], 'Your Pre-approval Details')}

    <h3 style="color: #374151; font-size: 18px; margin: 30 0 20px 0;">
      Ready to Find Your Dream Property?
    </h3>

    ${Timeline([
      { title: 'Complete Identity Verification', description: 'Verify your immigration and home identity ', status: 'current'},
      { title: 'Browse Properties', description: 'Explore our partner properties within your approved budget', status: 'pending'},
      { title: 'Down Payment',description: 'Make a down payment for the property', status: 'pending'}
    ])}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard/properties', 'Browse Properties', 'success')}
      ${EmailButton('https://www.usekletch.com/user-dashboard', 'Go to Dashboard')}
    </div>

    ${InfoBox(
      'Important Notice',
      'This pre-approval is subject to final verification of your income and identity documentation. The actual loan amount and terms may vary based on the property selected and final underwriting.',
      'info'
    )}

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

    ${StatusBadge('error', 'Application Not Approved', `Reference Number: ${referenceNumber}`)}

    ${rejectionReasons && rejectionReasons.length > 0 ? 
      InfoBox(
        'Why wasn\'t my application approved?',
        `
          <p style="margin: 0 0 15px 0;">Your application didn't meet our requirements in the following areas:</p>
          <ul style="margin: 0; padding-left: 20px;">
            ${rejectionReasons.map(reason => `<li style="margin-bottom: 5px;">${reason}</li>`).join('')}
          </ul>
        `,
        'error'
      ) : ''
    }
  
    <h3 style="color: #374151; font-size: 18px; margin: 30px 0 20px 0;">
      What Can You Do Next?
    </h3>

    ${Timeline([
      { title: 'Review Rejection Reasons', 
        description: 'Review the rejection reason stated above, fix in your application and then submit again', status: 'current'
      },
      { title: 'Contact Our Support Team',
        description: 'Our mortgage advisors can provide guidance on improving your application', status: 'pending'
      }
    ])}

    <div style="text-align: center; margin: 30px 0;">
      ${EmailButton('https://www.usekletch.com/support', 'Contact Support')}
    </div>

  `;
};