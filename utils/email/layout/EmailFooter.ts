import { EmailLayoutConfig } from "./EmailLayout";

export const EmailFooter = (config: EmailLayoutConfig) => {
  const { 
    companyName, 
    companyWebsite, 
    supportEmail, 
    socialLinks,
    unsubscribeUrl 
  } = config;
  
  return `
    <tr>
      <td style="background-color: #f9fafb; padding: 30px 20px; text-align: center; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">

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
      </td>
    </tr>
  `;
};