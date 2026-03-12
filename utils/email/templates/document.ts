import { formatDate } from "@/lib/formatter";
import { EmailButton, StatusBadge } from "../components/EmailButton";
import { DataTable, InfoBox } from "../components/EmailCard";

interface DocumentUploadParams {
  userName: string;
  applicationNumber: string;
  propertyName: string;
  uploadedDocuments: {
    name: string;
    type: string;
    uploadDate: string;
    description?: string;
  };
}

export const documentUploadNotificationEmail=(
  {
    userName,
    propertyName,
    applicationNumber,
    uploadedDocuments
  }:DocumentUploadParams
)=>{
  return `

    ${StatusBadge('info', 'Documents Uploaded', 'New property documents are available')}
 
    <h2 style="color: #4F46E5; font-size: 24px; margin: 0 0 10px 0;">
      Property Documents Available
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Your property documents for <strong>${propertyName}</strong> have been uploaded and are now available for review. 
      These important documents contain essential information about your property and mortgage.
    </p>

    ${DataTable([
      { label: 'Application Number', value: applicationNumber },
      { label: 'Property', value: propertyName },
      { label: 'Documents Uploaded', value: `${uploadedDocuments.type}` },
      { label: 'Uploaded By', value: "Kletch Admin Team" },
      { label: 'Upload Date', value: formatDate(uploadedDocuments.uploadDate)}
    ], 'Upload Summary')}
 
    ${InfoBox(
      'Newly Uploaded Documents',
      `
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-top: 10px;">
          <div style="border-bottom: 1px solid #e5e7eb; padding: 10px 0;">
            <p style="margin: 0 0 5px 0; font-weight: 600; color: #1f2937;">${uploadedDocuments.name}</p>
            <p style="margin: 0 0 5px 0; font-size: 14px; color: #6b7280;">
              <strong>Type:</strong> ${uploadedDocuments.type}
            </p>
            ${uploadedDocuments.description ? `
              <p style="margin: 0; font-size: 14px; color: #6b7280; font-style: italic;">
                ${uploadedDocuments.description}
              </p>
            ` : ''}
          </div>
         
        </div>
      `,
      'info'
    )}
 
    <h3 style="color: #374151; font-size: 18px; margin: 30px 0 20px 0;">
      Where to Find Your Documents
    </h3>
 
    ${InfoBox(
      'Pre-Activation Document Access',
      `
        <p style="margin: 0 0 15px 0;">Your documents are available in the Mortgage Activation section:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Dashboard → Applications → Expand ${applicationNumber} application column</strong></li>
          <li><strong>Navigate to "Mortgage Activation" section</strong></li>
          <li><strong>Documents tab:</strong> View and download available documents</li>
          <li><strong>Progress tracking:</strong> See which documents are still pending</li>
        </ul>
        <p style="margin: 15px 0 0 0; font-style: italic; color: #6b7280;">
          Additional documents will be added as your mortgage activation progresses.
        </p>
      `,
      'warning'
    )}
    
    <div style="text-align: center; margin: 40px 0;">
      ${EmailButton(`https://www.usekletch.com/applications/`, 'Go to Application', 'secondary')}
    </div>
 
    ${InfoBox(
      'Common Property Documents',
      `
        <p style="margin: 0 0 15px 0;">Here are the typical documents you can expect for your property:</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
          <div>
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">Legal Documents:</p>
            <ul style="margin: 0; padding-left: 15px; font-size: 14px; line-height: 1.6;">
              <li>Certificate of Occupancy (C of O)</li>
              <li>Deed of Assignment</li>
              <li>Purchase Agreement</li>
              <li>Title Documents</li>
            </ul>
          </div>
          <div>
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">Technical Documents:</p>
            <ul style="margin: 0; padding-left: 15px; font-size: 14px; line-height: 1.6;">
              <li>Survey Plan</li>
              <li>Building Plan Approval</li>
              <li>Property Valuation Report</li>
            </ul>
          </div>
        </div>
      `,
      'info'
    )}
 
    ${InfoBox(
      ' Document Security & Access',
      `
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Secure Storage:</strong> All documents are encrypted and securely stored</li>
          <li><strong>24/7 Access:</strong> View and download documents anytime from your dashboard</li>
          <li><strong>Legal Validity:</strong> All documents are legally verified and certified</li>
        </ul>
      `,
      'success'
    )}
 
    ${InfoBox(
       'Important Tips',
      `
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Review Promptly:</strong> Check uploaded documents within 48 hours</li>
          <li><strong>Download Copies:</strong> Save important documents to your device</li>
          <li><strong>Verify Details:</strong> Ensure all property details match your expectations</li>
          <li><strong>Ask Questions:</strong> Contact support if anything is unclear</li>
          <li><strong>Keep Organized:</strong> Create a folder system for easy document management</li>
        </ul>
      `,
      'warning'
    )}
 
    <div style="margin: 40px 0; text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
      <p style="color: #6b7280; font-size: 14px; margin: 0; line-height: 1.6;">
        These documents represent the legal foundation of your property ownership. 
        Keep them safe and accessible for future reference, property management, or any legal requirements.
      </p>
    </div>
  `;
};