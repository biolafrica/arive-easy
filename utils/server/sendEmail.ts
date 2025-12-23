import nodemailer from 'nodemailer'

export interface SendEmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

const transporter = nodemailer.createTransport({
  host:     process.env.SMTP_HOST,               
  port:     parseInt(process.env.SMTP_PORT!, 10), 
  secure:   process.env.SMTP_SECURE === 'true',  
  auth: {
    user: process.env.SMTP_USER,                 
    pass: process.env.SMTP_PASS                 
  }
})


export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  if (!to || !subject || !(text || html)) {
    throw new Error('sendEmail: missing to, subject or body')
  }

  const msg = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html
  }

  try {
    const info = await transporter.sendMail(msg)
    console.log('Email sent:', info.messageId)
    return info
  } catch (err) {
    console.error('Error sending email:', err)
    throw err
  }
}