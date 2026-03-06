import { EmailLayoutConfig } from "./EmailLayout";

export const EmailHeader = (config: EmailLayoutConfig) => {
  const { companyName, companyLogo, companyWebsite } = config;
  
  return `
    <tr>
      <td style="background-color: #4F46E5; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
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
      </td>
    </tr>
  `;
};
