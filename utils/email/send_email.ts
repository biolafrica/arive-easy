import nodemailer from 'nodemailer';
import { emailLayout, EmailLayoutConfig } from './email-layout';

export interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  useLayout?: boolean; 
  layoutConfig?: EmailLayoutConfig; 
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

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

  const finalHtml = html && useLayout 
    ? emailLayout(html, layoutConfig)
    : html;

  const msg = {
    from: `${layoutConfig?.companyName || 'Kletch'} <${process.env.SMTP_FROM}>`,
    to,
    subject,
    text,
    html: finalHtml
  };

  try {
    const info = await transporter.sendMail(msg);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}

export async function sendPlainEmail(options: Omit<SendEmailOptions, 'useLayout'>) {
  return sendEmail({ ...options, useLayout: false });
}