import { EmailButton, StatusBadge } from "../components/EmailButton";
import { DataTable, InfoBox, Timeline } from "../components/EmailCard";

interface AdminSellerNotificationProps{
  sellerName:string;
  sellerEmail:string;
  sellerId:string
}

export const userWelcomeEmail = ({
  userName,
}:{userName:string})=>{
  return `
    <h2 style="color: #1f2937; font-size: 28px; margin: 0 0 20px 0; text-align: center;">
      Welcome to Kletch, ${userName}! 
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
      We know your story because it's one we've heard countless times. You've worked hard to build a life abroad, 
      yet every time you think about investing back home, the same concerns surface: <em>Can I trust this process? 
      Will I be taken advantage of? How do I manage everything from thousands of miles away?</em>
    </p>

    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
      You're not alone. <strong>Too many immigrants have been burned by unreliable developers, 
      hidden fees, and broken promises.</strong> Many have simply given up on their dream of owning property back home.
    </p>

    ${StatusBadge('success', 'Your Journey Starts Here', 'We built Kletch specifically to solve these problems')}

    ${InfoBox(
      'We Understand Your Concerns',
      `
        <p style="margin: 0 0 15px 0; line-height: 1.6;">We've talked to hundreds of immigrants who share your frustrations:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Trust Issues:</strong> "How do I know the developer won't disappear with my money?"</li>
          <li><strong>Financial Strain:</strong> "I can't afford to pay everything upfront"</li>
          <li><strong>Distance Barriers:</strong> "I can't be there to monitor progress"</li>
          <li><strong>Hidden Costs:</strong> "Every project seems to cost more than promised"</li>
          <li><strong>Legal Complexity:</strong> "I don't understand the local laws and processes"</li>
        </ul>
      `,
      'info'
    )}

    <h3 style="color: #374151; font-size: 20px; margin: 40px 0 20px 0; text-align: center;">
      How Kletch Changes Everything
    </h3>

    ${Timeline([
      {
        title: 'Secure Mortgage Financing',
        description: 'Pay in affordable monthly installments instead of huge lump sums. Your money is protected through our banking partners.',
        status: 'completed'
      },
      {
        title: 'Vetted Developers Only',
        description: 'Every developer on our platform is thoroughly verified. No more worrying about fraudulent contractors.',
        status: 'current'
      },
      {
        title: 'Complete Transparency',
        description: 'Track your property progress in real-time through photos, videos, and milestone updates.',
        status: 'pending'
      },
      {
        title: 'Your Dream Home Awaits',
        description: 'Own your property back home without the stress. Plus, no more expensive Airbnb costs when you visit!',
        status: 'pending'
      }
    ])}

    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 8px; margin: 30px 0; text-align: center;">
      <h3 style="color: white; margin: 0 0 15px 0; font-size: 20px;">
        Imagine This...
      </h3>
      <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 6px;">
        <p style="color: white; margin: 0 0 10px 0; font-size: 16px; line-height: 1.6;">
          <strong>Next year</strong>, when you visit home, you're not scrambling for expensive accommodation. 
        </p>
        <p style="color: white; margin: 0; font-size: 16px; line-height: 1.6;">
          You have the keys to <strong>your own property</strong> – paid for comfortably through manageable monthly payments, 
          built by developers you can trust, in a process that was transparent from day one.
        </p>
      </div>
    </div>

    <h3 style="color: #374151; font-size: 18px; margin: 30px 0 20px 0;">
      What Happens Next?
    </h3>

    ${Timeline([
      {
        title: 'Complete Your Profile',
        description: 'Tell us about your property dreams and financial goals',
        status: 'current'
      },
      {
        title: 'Get Pre-Approved',
        description: 'Quick mortgage pre-approval process (usually within 48 hours)',
        status: 'pending'
      },
      {
        title: 'Browse & Choose',
        description: 'Explore verified properties from trusted developers',
        status: 'pending'
      },
      {
        title: 'Start Building',
        description: 'Watch your dream home come to life with full transparency',
        status: 'pending'
      }
    ])}

    <div style="text-align: center; margin: 40px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard', 'Start Your Journey Now', 'success')}
    </div>

    ${InfoBox(
      'We\'re Here for You',
      `
        <p style="margin: 0 0 10px 0;">Building from abroad shouldn't be scary or stressful. Our team understands the unique challenges you face, and we're here to support you every step of the way.</p>
        <p style="margin: 0;"><strong>Questions?</strong> Reply to this email or reach out anytime at <a href="mailto:support@usekletch.com" style="color: inherit; font-weight: 600;">support@usekletch.com</a></p>
      `,
      'success'
    )}

    <div style="margin: 40px 0; text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; font-style: italic;">
        "Your dream of owning property back home isn't just possible – it's within reach."
      </p>
      <p style="color: #374151; font-size: 14px; margin: 0; font-weight: 600;">
        – The Kletch Team
      </p>
    </div>

  `;

};

export const sellerWelcomeEmail =({
  sellerName
}:{sellerName:string})=>{
  return `
    <h2 style="color: #1f2937; font-size: 28px; margin: 0 0 20px 0; text-align: center;">
      Welcome to Kletch, ${sellerName}!
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
      Dear ${sellerName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 25px 0;">
      Congratulations on taking the first step toward transforming your development business! 
      We understand the challenges you face: limited local buyers, cash flow constraints, 
      and the constant pressure to find serious investors who can actually complete their purchases.
    </p>

    <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
      You've built quality properties, but reaching buyers with the financial capability and genuine intent to buy 
      has always been the bottleneck. <strong>That changes today.</strong>
    </p>

    ${StatusBadge('success', 'Phase 1 Complete!', 'Account created successfully')}

    <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; border-radius: 8px; margin: 30px 0; text-align: center;">
      <h3 style="color: white; margin: 0 0 15px 0; font-size: 24px;">
        Unlock a Global Market
      </h3>
      <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 6px;">
        <p style="color: white; margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
          <strong>Millions of immigrants abroad</strong> are looking for exactly what you're building.
        </p>
        <p style="color: white; margin: 0; font-size: 16px; line-height: 1.6;">
          They have steady incomes, strong motivation to invest back home, and now – 
          thanks to Kletch – they have the <strong>financing and trust</strong> they need to buy from you.
        </p>
      </div>
    </div>

    ${InfoBox(
      'How Kletch Transforms Your Business',
      `
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Pre-Qualified Buyers:</strong> Every customer comes with mortgage pre-approval</li>
          <li><strong>Guaranteed Payments:</strong> Our banking partners ensure you get paid on schedule</li>
          <li><strong>Global Reach:</strong> Access diaspora markets in US, UK, Canada, and more</li>
          <li><strong>No Payment Hassles:</strong> We handle all payment collection and processing</li>
          <li><strong>Marketing Support:</strong> Professional property listings that sell</li>
          <li><strong>Legal Protection:</strong> Comprehensive contracts and dispute resolution</li>
        </ul>
      `,
      'success'
    )}

    <h3 style="color: #374151; font-size: 20px; margin: 40px 0 20px 0; text-align: center;">
      Your Success Roadmap
    </h3>

    ${Timeline([
      {
        title: 'Account Created',
        description: 'Welcome! You\'ve successfully joined the Kletch platform',
        status: 'completed'
      },
      {
        title: 'Complete Verification',
        description: 'Verify your business and properties to start listing (we make this easy)',
        status: 'current'
      },
      {
        title: 'List Your Properties',
        description: 'Our team helps you create compelling listings that attract international buyers',
        status: 'pending'
      },
      {
        title: 'Start Selling',
        description: 'Connect with pre-qualified buyers and grow your revenue',
        status: 'pending'
      }
    ])}

    ${InfoBox(
      'What This Means for Your Bottom Line',
      `
        <p style="margin: 0 0 15px 0; line-height: 1.6;">Imagine increasing your sales by <strong>300-500%</strong> by tapping into the diaspora market:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Properties that used to take 12-18 months to sell now move in 3-6 months</li>
          <li>Buyers with <strong>proven financing</strong> means fewer deals falling through</li>
          <li>International buyers often pay <strong>premium prices</strong> for quality properties</li>
          <li>Consistent monthly payments improve your cash flow dramatically</li>
        </ul>
      `,
      'success'
    )}

    <div style="text-align: center; margin: 40px 0;">
      ${EmailButton('https://www.usekletch.com/seller-dashboard', 'Complete Verification & Start Listing', 'success')}
    </div>

    ${DataTable([
      { label: 'Your Customer Success Agent', value: 'Tayo' },
      { label: 'Direct Email', value: "support@usekletch.com" },
      { label: 'Next Step', value: 'Complete verification process' },
      { label: 'Timeline', value: '24-48 hours to get fully set up' }
    ], 'Your Dedicated Support Team')}

    <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
      <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
        Personal Guidance Every Step of the Way
      </h4>
      <p style="color: #1e40af; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
        <strong>Tayo</strong> is your dedicated customer success agent. They will:
      </p>
      <ul style="color: #1e40af; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
        <li>Guide you through the verification process step-by-step</li>
        <li>Help optimize your property listings for maximum appeal</li>
        <li>Provide ongoing support to maximize your sales</li>
        <li>Be your direct contact for any questions or concerns</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      ${EmailButton('mailto:support@usekletch.com', 'Contact Your Success Agent', 'primary')}
    </div>

    <div style="margin: 40px 0; text-align: center; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; font-style: italic;">
        "We're not just a platform – we're your partner in growth."
      </p>
      <p style="color: #374151; font-size: 14px; margin: 0; font-weight: 600;">
        Welcome to the future of real estate development.
      </p>
    </div>

    ${InfoBox(
      'Questions? We\'re Here to Help',
      `
        <p style="margin: 0 0 10px 0;">Starting something new always comes with questions. That's completely normal, and we're here to help every step of the way.</p>
        <p style="margin: 0;">Reach out to <strong>Tayo</strong> at <a href="mailto:support@usekletch.com" style="color: inherit; font-weight: 600;">support@usekletch.com</a> or our support team at <a href="mailto:seller-support@usekletch.com" style="color: inherit; font-weight: 600;">seller-support@usekletch.com</a></p>
      `,
      'info'
    )}



  `
}

export const adminSellerNotificationEmail=({
  sellerName, sellerEmail, sellerId}:AdminSellerNotificationProps
)=>{
  return `
    <h2 style="color: #f59e0b; font-size: 20px; margin: 0 0 15px 0;">
      ⚡ New Seller Alert
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; margin: 0 0 20px 0;">
      <strong>${sellerName}</strong> just registered and needs verification support.
    </p>

    ${DataTable([
      { label: 'Name', value: sellerName },
      { label: 'Email', value: sellerEmail },
      { label: 'ID', value: sellerId },
      { label: 'Time', value: new Date().toLocaleString() }
    ])}

    <div style="text-align: center; margin: 20px 0;">
      ${EmailButton(`mailto:${sellerEmail}`, 'Contact Now', 'warning')}
    </div>

    <p style="color: #ef4444; font-size: 14px; text-align: center; margin: 0;">
      <strong>Target: Contact within 2 hours</strong>
    </p>

  `
}

export const confirmationLinkEmail=({username, url}:{
  username:string,
  url:string
})=>{
  return`
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4F46E5;">Welcome to Kletch!</h1>
      <p>Hi ${username},</p>
      <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
      <a href="${url}" 
          style="display: inline-block; margin: 20px 0; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email Address
      </a>
      <p style="color: #666; font-size: 14px;">
        Or copy and paste this link in your browser:<br>
        ${url}
      </p>
      <p style="color: #666; font-size: 14px;">
        This link will expire in 24 hours.
      </p>
    </div>
  `;
};