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
  companyWebsite: 'https://eatupng.com',
  supportEmail: 'info@ariveasy.com',
  companyLogo: 'https://ariveasy.com/logo.png',
};

export const emailHeader = (config: EmailLayoutConfig = {}) => {
  const { companyName, companyLogo, companyWebsite } = { ...defaultConfig, ...config };
  
  return `
    <div style="background-color: #4F46E5; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
      ${companyLogo ? `
        <a href="${companyWebsite}" style="display: inline-block; margin-bottom: 10px;">
          <img src="${companyLogo}" alt="${companyName}" style="max-height: 40px; width: auto;">
        </a>
      ` : `
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
          <a href="${companyWebsite}" style="color: white; text-decoration: none;">
            ${companyName}
          </a>
        </h1>
      `}
      <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">
        Your trusted mortgage partner for the African diaspora
      </p>
    </div>
  `;
};

export const emailFooter = (config: EmailLayoutConfig = {}) => {
  const { 
    companyName, 
    companyWebsite, 
    supportEmail, 
    socialLinks,
    unsubscribeUrl 
  } = { ...defaultConfig, ...config };
  
  return `
    <div style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
      
      <!-- Contact Information -->
      <div style="margin-bottom: 20px;">
        <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
          Need help? We're here for you!
        </p>
        <p style="margin: 5px 0;">
          <a href="mailto:${supportEmail}" style="color: #4F46E5; text-decoration: none; font-weight: 500;">
            ${supportEmail}
          </a>
        </p>
        <p style="margin: 5px 0;">
          <a href="${companyWebsite}" style="color: #4F46E5; text-decoration: none;">
            Visit our website
          </a>
        </p>
      </div>

      <!-- Social Media Links -->
      ${socialLinks ? `
        <div style="margin: 20px 0;">
          <table align="center" style="display: inline-table;">
            <tr>
              ${socialLinks.facebook ? `
                <td style="padding: 0 8px;">
                  <a href="${socialLinks.facebook}" style="display: inline-block;">
                    <img src="https://cdn-icons-png.flaticon.com/32/733/733547.png" 
                         alt="Facebook" width="24" height="24" style="display: block;">
                  </a>
                </td>
              ` : ''}
              ${socialLinks.twitter ? `
                <td style="padding: 0 8px;">
                  <a href="${socialLinks.twitter}" style="display: inline-block;">
                    <img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" 
                         alt="Twitter" width="24" height="24" style="display: block;">
                  </a>
                </td>
              ` : ''}
              ${socialLinks.linkedin ? `
                <td style="padding: 0 8px;">
                  <a href="${socialLinks.linkedin}" style="display: inline-block;">
                    <img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" 
                         alt="LinkedIn" width="24" height="24" style="display: block;">
                  </a>
                </td>
              ` : ''}
              ${socialLinks.instagram ? `
                <td style="padding: 0 8px;">
                  <a href="${socialLinks.instagram}" style="display: inline-block;">
                    <img src="https://cdn-icons-png.flaticon.com/32/2111/2111463.png" 
                         alt="Instagram" width="24" height="24" style="display: block;">
                  </a>
                </td>
              ` : ''}
            </tr>
          </table>
        </div>
      ` : ''}

      <!-- Legal/Compliance -->
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
          © ${new Date().getFullYear()} ${companyName}. All rights reserved.
        </p>
        <p style="color: #9ca3af; font-size: 11px; margin: 5px 0;">
          Empowering the African diaspora to invest in home
        </p>
        ${unsubscribeUrl ? `
          <p style="margin: 10px 0 0 0;">
            <a href="${unsubscribeUrl}" style="color: #9ca3af; font-size: 11px; text-decoration: underline;">
              Unsubscribe from these emails
            </a>
          </p>
        ` : ''}
      </div>
    </div>
  `;
};

export const emailLayout = (
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
              <!-- Header -->
              <tr>
                <td>${emailHeader(config)}</td>
              </tr>
              
              <!-- Main Content -->
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  ${content}
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td>${emailFooter(config)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};