import { Resend } from 'resend';
import { EmailLayout, EmailLayoutConfig } from './layout/EmailLayout';

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  useLayout?: boolean;
  layoutConfig?: EmailLayoutConfig;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  text,
  html,
  useLayout = true,
  layoutConfig = {}
}: SendEmailOptions) {
  if (!to || !subject || !(text || html)) {
    throw new Error('sendEmail: missing to, subject or body');
  }

  const finalHtml = html && useLayout ? EmailLayout(html, layoutConfig) : html;
  const payload = {
    from: `${layoutConfig?.companyName || 'Kletch'} <${process.env.RESEND_FROM}>`,
    to,
    subject,
    text: text ?? '',
    html: finalHtml ?? '',
  };

  try {
    const { data, error } = await resend.emails.send(payload as any);
    if (error) {
      console.error('Error sending email:', error);
      throw new Error(error.message);
    }

    console.log('Email sent:', data?.id);
    return data;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}

export async function sendPlainEmail(options: Omit<SendEmailOptions, 'useLayout'>) {
  return sendEmail({ ...options, useLayout: false });
}