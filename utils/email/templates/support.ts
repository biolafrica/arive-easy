import { EmailButton } from "../components/EmailButton";
import { DataTable } from "../components/EmailCard";

interface SupportEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  ticketId: string;
  timestamp: string;
  userAgent: string;
  ipAddress: string;
}

interface AcknowledgementData {
  name: string;
  subject: string;
  ticketId: string;
  estimatedResponseTime: string;
}

export const EmailSupportTemplate = (data: SupportEmailData) => {
  const formattedDate = new Date(data.timestamp).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Support Request</title>
    </head>

    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">

        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Support Request</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Ticket #${data.ticketId}</p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 30px;">
                  <!-- Priority Badge -->
                  <div style="text-align: center; margin-bottom: 20px;">
                    <span style="background-color: #fbbf24; color: #92400e; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                      New Request
                    </span>
                  </div>

                  ${DataTable([
                    { label: 'Name', value: data.name },
                    { label: 'Email', value: data.email },
                    { label: 'Subject', value: data.subject, highlight: true }
                  ], 'Customer Information')}
                  
                  <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                    <h2 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                      Message
                    </h2>
                    <p style="color: #374151; line-height: 1.6; white-space: pre-wrap; margin: 0;">
                      ${data.message}
                    </p>
                  </div>
                  
                  <div style="background-color: #fef3c7; border-radius: 6px; padding: 15px; border: 1px solid #fcd34d;">
                    <h3 style="color: #92400e; font-size: 14px; margin: 0 0 10px 0;">
                      Request Details
                    </h3>
                    <table style="font-size: 12px; color: #92400e;">
                      <tr>
                        <td style="padding: 3px 10px 3px 0;"><strong>Submitted:</strong></td>
                        <td>${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 10px 3px 0;"><strong>IP Address:</strong></td>
                        <td>${data.ipAddress}</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 10px 3px 0;"><strong>Browser:</strong></td>
                        <td style="font-size: 11px;">${data.userAgent.substring(0, 50)}...</td>
                      </tr>
                    </table>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="mailto:${data.email}?subject=Re: ${data.subject} [${data.ticketId}]" 
                       style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600;">
                      Reply to Customer
                    </a>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    This is an automated message from Kletch Support System
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export const EmailSupportAcknowledgement = (data: AcknowledgementData) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>We've Received Your Request</title>
    </head>

    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 20px 0;">
      
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                  <div style="display: inline-block; padding: 15px 25px; background-color: rgba(255,255,255,0.1); border-radius: 8px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Kletch</h1>
                  </div>
                  <p style="color: #ffffff; margin: 15px 0 0 0; font-size: 16px; opacity: 0.95;">
                    Your Mortgage Journey, Simplified
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-block; width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; position: relative;">
                      <span style="color: white; font-size: 30px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">✓</span>
                    </div>
                    <h2 style="color: #111827; font-size: 24px; margin: 20px 0 10px 0;">
                      Thank you for contacting us!
                    </h2>
                    <p style="color: #6b7280; font-size: 16px; margin: 0;">
                      We've received your support request
                    </p>
                  </div>
                  
                  <div style="background-color: #f3f4f6; border-radius: 8px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                    <h3 style="color: #374151; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                      Your Request Details
                    </h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">
                          <strong>Ticket ID:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-family: monospace; font-weight: 600;">
                          ${data.ticketId}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">
                          <strong>Subject:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #111827;">
                          ${data.subject}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">
                          <strong>Response Time:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #111827;">
                          Within ${data.estimatedResponseTime}
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Greeting Message -->
                  <div style="border-left: 3px solid #e5e7eb; padding-left: 20px; margin: 30px 0;">
                    <p style="color: #374151; line-height: 1.6; margin: 0 0 15px 0;">
                      Dear ${data.name},
                    </p>
                    <p style="color: #374151; line-height: 1.6; margin: 0 0 15px 0;">
                      Thank you for reaching out to Kletch Support. We understand that your time is valuable, and we're committed to addressing your inquiry as quickly as possible.
                    </p>
                    <p style="color: #374151; line-height: 1.6; margin: 0;">
                      Our support team has been notified and will review your request shortly. You can expect a response within <strong>${data.estimatedResponseTime}</strong>. If your issue is urgent, please don't hesitate to follow up with your ticket ID.
                    </p>
                  </div>
                  
                  <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #fcd34d;">
                    <h3 style="color: #92400e; font-size: 16px; margin: 0 0 15px 0;">
                      What happens next?
                    </h3>
                    <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.8;">
                      <li>Our team will review your request</li>
                      <li>We'll investigate the issue or answer your question</li>
                      <li>You'll receive a detailed response via email</li>
                      <li>We'll keep this ticket open until your issue is resolved</li>
                    </ul>
                  </div>
                  
                  <div style="text-align: center; padding: 30px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; margin: 30px 0;">
                    <h3 style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                      While you wait, you might find these helpful:
                    </h3>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      ${EmailButton(`${process.env.NEXT_PUBLIC_BASE_URL}/faq`, 'Contact Info', 'primary')}
                      ${EmailButton(`${process.env.NEXT_PUBLIC_BASE_URL}/support`, 'Contact Info', 'secondary')}
                    </div>
                  </div>
                  
                  <div style="margin-top: 30px;">
                    <p style="color: #374151; line-height: 1.6; margin: 0 0 5px 0;">
                      Best regards,
                    </p>
                    <p style="color: #374151; font-weight: 600; margin: 0;">
                      The Kletch Support Team
                    </p>
                  </div>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center">
                        <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
                          © ${new Date().getFullYear()} Kletch. All rights reserved.
                        </p>
                        <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                          Please keep this email for your records. Your ticket ID is: <strong>${data.ticketId}</strong>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}