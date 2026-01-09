
import { sendEmail } from "@/utils/email/send_email";
import { EmailSupportAcknowledgement, EmailSupportTemplate } from "@/utils/email/support";
import { z } from "zod";


const supportRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

const SUPPORT_CONFIG = {
  primaryEmail: process.env.SUPPORT_EMAIL || 'biolafrica@gmail.com',
  fallbackEmail: process.env.SUPPORT_FALLBACK_EMAIL || 'support@ariveasy.com',
  replyTo: 'no-reply@ariveasy.com',
  companyName: 'Ariveasy',
};

export async function POST(req: Request) {

  try {
    const body = await req.json();
    
    const validationResult = supportRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return Response.json(
        { 
          success: false, 
          errors: validationResult.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;


    const sanitizedData = {
      name: name.replace(/[<>]/g, ''),
      email: email.toLowerCase().trim(),
      subject: subject.replace(/[<>]/g, ''),
      message: message.replace(/[<>]/g, ''),
    };

    const ticketId = `SUPPORT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;


    const supportEmailPromise = sendEmail({
      to: SUPPORT_CONFIG.primaryEmail,
      subject: `[${ticketId}] Support Request: ${sanitizedData.subject}`,
      html: EmailSupportTemplate({
        ...sanitizedData,
        ticketId,
        timestamp: new Date().toISOString(),
        userAgent: req.headers.get('user-agent') || 'Unknown',
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown',
      }),
      useLayout: false,
    });

  
    const userEmailPromise = sendEmail({
      to: sanitizedData.email,
      subject: `We received your request: ${sanitizedData.subject} [${ticketId}]`,
      html: EmailSupportAcknowledgement({
        name: sanitizedData.name,
        subject: sanitizedData.subject,
        ticketId,
        estimatedResponseTime: '24-48 hours',
      }),
      useLayout: false,
    });


    const [supportResult, userResult] = await Promise.allSettled([
      supportEmailPromise,
      userEmailPromise,
    ]);


    if (supportResult.status === 'rejected') {
      console.error('Failed to send support email:', supportResult.reason);

      try {
        await sendEmail({
          to: SUPPORT_CONFIG.fallbackEmail,
          subject: `[FALLBACK] [${ticketId}] Support Request: ${sanitizedData.subject}`,
          html: EmailSupportTemplate({
            ...sanitizedData,
            ticketId,
            timestamp: new Date().toISOString(),
            userAgent: 'Fallback',
            ipAddress: 'Fallback',
          }),
        });
      } catch (fallbackError) {
        console.error('Fallback email also failed:', fallbackError);
        
        return Response.json(
          { 
            success: false, 
            error: 'Unable to process your request at this time. Please try again later or contact us directly.' 
          }, 
          { status: 503 }
        );
      }
    }


    if (userResult.status === 'rejected') {
      console.error('Failed to send user acknowledgement:', userResult.reason);
    }

    return Response.json(
      { success: true, ticketId, message: 'Your support request has been received successfully.'}, { status: 200 }
    );
    
  } catch (error) {
    console.error('Support request error:', error);
    
    return Response.json(
      { success: false, error: 'An unexpected error occurred. Please try again.'}, { status: 500 }
    );
  }
}
