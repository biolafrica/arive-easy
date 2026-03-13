import { EmailFooter } from "./EmailFooter";
import { EmailHeader } from "./EmailHeader";
import logo from '@/public/icons/kletch-email.svg'

export interface EmailLayoutConfig {
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  supportEmail?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  unsubscribeUrl?: string;
}

const defaultConfig: EmailLayoutConfig = {
  companyName: 'Kletch',
  companyWebsite: 'https://usekletch.com',
  supportEmail: 'support@usekletch.com',
  companyLogo: logo,
};

export const EmailLayout = (
  content: string, 
  config: EmailLayoutConfig = {}
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.companyName || defaultConfig.companyName}</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <tr>
                <td>${EmailHeader(defaultConfig)}</td>
              </tr>
              
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  ${content}
                </td>
              </tr>
              
              <tr>
                <td>${EmailFooter(defaultConfig)}</td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};