import { formatUSD, toNumber } from "@/lib/formatter";
import { AmountDisplay, EmailButton, StatusBadge } from "../components/EmailButton";
import { DataTable, InfoBox, Timeline } from "../components/EmailCard";

interface TermsCompletionParams {
  userName: string;
  applicationNumber: string;
  propertyName: string;
}

interface PaymentCompletionParams {
  userName: string;
  propertyName: string;
  totalPaid: string;
  paymentBreakdown: {
    escrow: string;
    legal: string;
    valuation: string;
  };
}

interface MortgageActivationParams {
  userName: string;
  applicationNumber: string;
  propertyName: string;
  mortgageAmount: string;
  monthlyPayment: string;
  firstPaymentDate: string;
  totalLoanTerm: number;

}

interface PropertyAcquiredParams {
  sellerName: string;
  propertyName: string;
  propertyId: string;
  buyerName: string;
  saleAmount: string;
  applicationNumber: string;
}

interface AdminEscrowProps {
  amount:string;
  propertyName:string;
  applicationNumber:string;
  transactionID:string;
  sellerName:string;
  sellerID:string;
  sellerEmail:string
  buyerName:string;
}

export const termsCompletionEmail=({
  userName,
  applicationNumber,
  propertyName,
}:TermsCompletionParams)=>{
  return `

    ${StatusBadge('success', 'Terms & Conditions Completed', 'Legal documentation accepted successfully')}

    <h2 style="color: #10b981; font-size: 24px; margin: 0 0 10px 0;">
      Terms and DownPayment Stage Complete!
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Congratulations! You've successfully make a down payment for your property, completed and accepted the terms and conditions for your mortgage application. 
      This is an important milestone that brings you one step closer to owning your dream property.
    </p>

    ${DataTable([
      { label: 'Application Number', value: applicationNumber },
      { label: 'Property', value: propertyName },
      { label: 'Terms Accepted', value: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) },
      { label: 'Status', value: 'Terms and Agreement Stage Complete ', highlight: true }
    ], 'Application Progress')}

    ${InfoBox(
      'What You\'ve Just Completed',
      `
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
         <li><strong>Down Payment:</strong> Secured you chosen property ${propertyName} </li>
          <li><strong>Mortgage Agreement:</strong> Terms of your loan and repayment schedule</li>
          <li><strong>Property Purchase Terms:</strong> Conditions specific to your chosen property</li>
        </ul>
      `,
      'success'
    )}

    <h3 style="color: #374151; font-size: 18px; margin: 30px 0 20px 0;">
      Your Journey Progress
    </h3>

    ${Timeline([
      {
        title: 'Pre-approval Completed',
        description: 'Your mortgage application was pre-approved',
        status: 'completed'
      },
      {
        title: 'Identity Verification',
        description: 'Your identity and income were verified',
        status: 'completed'
      },
      {
        title: 'Property Selection',
        description: 'You selected your dream property',
        status: 'completed'
      },
      {
        title: 'Legal Documentation ',
        description: 'Terms and conditions accepted (Just completed!)',
        status: 'completed'
      },
      {
        title: 'Payment Processing',
        description: 'Complete required payments for property securing',
        status: 'current'
      },
      {
        title: 'Mortgage Activation',
        description: 'Final activation and property ownership transfer',
        status: 'pending'
      }
    ])}

    ${InfoBox(
      ' Next Step: Secure Your Property',
      `
        <p style="margin: 0 0 15px 0;">Now that the legal framework is in place, it's time to secure your property with the required payments:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Legal Processing Fee:</strong> Covers document processing and registration</li>
          <li><strong>Valuation Fee:</strong> Professional property assessment</li>
        </ul>
      `,
      'warning'
    )}

    <div style="text-align: center; margin: 40px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard/applications', 'Proceed to Application Stage', 'success')}
    </div>

    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
      <h3 style="color: white; margin: 0 0 15px 0; font-size: 18px;">
        You're Almost Home!
      </h3>
      <p style="color: white; margin: 0; font-size: 14px; line-height: 1.6; opacity: 0.95;">
        With legal documentation complete, you're now just two steps away from owning your property. 
        The hardest parts are behind you!
      </p>
    </div>
  `;
};

export const paymentCompletionEmail=({
  userName,
  propertyName,
  totalPaid,
  paymentBreakdown,
}:PaymentCompletionParams)=>{
  return `

    ${StatusBadge('success', 'All Payments Complete', 'Property secured successfully')}

    <h2 style="color: #10b981; font-size: 24px; margin: 0 0 10px 0;">
      Payment Stage Complete!
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Excellent news! All required payments have been successfully processed and your property is now officially secured. 
      Your ${propertyName} is reserved exclusively for you while we complete the final activation process.
    </p>

    ${AmountDisplay(formatUSD({amount:toNumber(totalPaid)}), 'Total Investment Secured')}

    ${DataTable([
      { label: 'Escrow Payment', value:  formatUSD({amount:toNumber(paymentBreakdown.escrow)}) },
      { label: 'Legal Processing', value:  formatUSD({amount:toNumber(paymentBreakdown.legal)})},
      { label: 'Property Valuation', value:  formatUSD({amount:toNumber(paymentBreakdown.valuation)}) },
      { label: 'Total Paid', value:  formatUSD({amount:toNumber(totalPaid)}), highlight: true },
    ], 'Payment Summary')}

    ${InfoBox(
      'Your Investment is Protected',
      `
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Escrow Protection:</strong> Your funds are held in secure, regulated escrow accounts</li>
          <li><strong>Legal Documentation:</strong> All payments are legally documented and insured</li>
          <li><strong>Property Reserved:</strong> Your chosen property is exclusively yours</li>
          <li><strong>Full Transparency:</strong> Complete payment trail and documentation available</li>
        </ul>
      `,
      'success'
    )}

    <h3 style="color: #374151; font-size: 18px; margin: 30px 0 20px 0;">
      Your Journey Progress
    </h3>

    ${Timeline([
      {
        title: 'Pre-approval Completed',
        description: 'Mortgage application approved',
        status: 'completed'
      },
      {
        title: 'Legal Documentation',
        description: 'Terms and conditions accepted',
        status: 'completed'
      },
      {
        title: 'Payment Processing',
        description: 'All required payments completed (Just finished!)',
        status: 'completed'
      },
      {
        title: 'Final Verification',
        description: 'Property valuation and final checks in progress',
        status: 'current'
      },
      {
        title: 'Mortgage Activation',
        description: 'Final activation and property ownership transfer',
        status: 'pending'
      }
    ])}

    ${InfoBox(
      'What Happens Next?',
      `
        <p style="margin: 0 0 15px 0;">Our team is now working behind the scenes to complete your mortgage activation:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Final Legal Review:</strong> Document verification and registration preparation</li>
          <li><strong>Bank Processing:</strong> Final mortgage activation with our banking partners</li>
          <li><strong>Ownership Transfer:</strong> Property title transfer to your name</li>
        </ul>
      `,
      'info'
    )}

    <div style="text-align: center; margin: 40px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard/payments', 'View Payment History', 'success')}
      ${EmailButton('https://www.usekletch.com/user-dashboard/applications/', 'Track Progress', 'primary')}
    </div>

    <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px; border-radius: 8px; margin: 30px 0; text-align: center;">
      <h3 style="color: white; margin: 0 0 15px 0; font-size: 20px;">
        You're So Close!
      </h3>
      <p style="color: white; margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
        With payments complete, you're now in the final stretch. In just a few days, you'll officially own your property back home!
      </p>
      <div style="background-color: rgba(255,255,255,0.2); padding: 15px; border-radius: 6px;">
        <p style="color: white; margin: 0; font-size: 14px;">
          <strong>Next visit home:</strong> You'll have the keys to your own place!
        </p>
      </div>
    </div>
  `;
};

export const mortgageActivationEmail=({
  userName,
  propertyName,
  mortgageAmount,
  totalLoanTerm,
  applicationNumber,
  monthlyPayment,
  firstPaymentDate
}:MortgageActivationParams)=>{
  return `
    ${StatusBadge('success', 'Mortgage Activated!', 'Congratulations - You\'re now a property owner!')}

    <h2 style="color: #10b981; font-size: 28px; margin: 0 0 10px 0; text-align: center;">
      Welcome Home, ${userName}!
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${userName},
    </p>
    
    <p style="color: #4b5563; font-size: 18px; line-height: 1.7; margin: 0 0 30px 0; font-weight: 500;">
      <strong>Congratulations!</strong> Your mortgage has been successfully activated and you are now the official owner of 
      <strong>${propertyName}</strong>. Your dream of owning property back home has become a reality!
    </p>

    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 8px; margin: 30px 0; text-align: center;">
      <h3 style="color: white; margin: 0 0 20px 0; font-size: 24px;">
        Your Property Details
      </h3>
      <div style="background-color: rgba(255,255,255,0.1); padding: 20px; border-radius: 6px; text-align: left;">
        <p style="color: white; margin: 0 0 10px 0; font-size: 16px;">
          <strong>Property:</strong> ${propertyName}
        </p>
        <p style="color: white; margin: 0 0 10px 0; font-size: 16px;">
          <strong>Total Value:</strong> ${formatUSD({amount:toNumber(mortgageAmount)}) }
        </p>
        <p style="color: white; margin: 0; font-size: 16px;">
          <strong>Activated:</strong> ${new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>

    ${DataTable([
      { label: 'Application Number', value: applicationNumber },
      { label: 'Property Name', value: propertyName },
      { label: 'Mortgage Amount', value: formatUSD({amount:toNumber(mortgageAmount)}), highlight: true },
      { label: 'Monthly Payment', value: formatUSD({amount:toNumber( monthlyPayment)}), highlight: true },
      { label: 'Loan Term', value: `${totalLoanTerm} years` },
      { label: 'First Payment Due', value: new Date(firstPaymentDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) }
    ], ' Mortgage Summary')}

    ${InfoBox(
      ' What This Means for You',
      `
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>You Own Property:</strong> Legal ownership is transferred to your name</li>
          <li><strong>No More Rent Back Home:</strong> Stay in your own place when you visit</li>
          <li><strong>Investment Asset:</strong> Your property can appreciate in value over time</li>
          <li><strong>Family Legacy:</strong> A tangible asset you can pass to your children</li>
          <li><strong>Stable Payments:</strong> Fixed monthly payments for ${totalLoanTerm} years</li>
        </ul>
      `,
      'success'
    )}

    <h3 style="color: #374151; font-size: 18px; margin: 30px 0 20px 0;">
      Your Complete Journey
    </h3>

    ${Timeline([
      {
        title: 'Application Started',
        description: 'Your journey to property ownership began',
        status: 'completed'
      },
      {
        title: 'Pre-approval Granted',
        description: 'Mortgage eligibility confirmed',
        status: 'completed'
      },
      {
        title: 'Property Selected',
        description: 'Found your perfect property',
        status: 'completed'
      },
      {
        title: 'Legal & Payments',
        description: 'Documentation and payments completed',
        status: 'completed'
      },
      {
        title: 'Mortgage Activated ',
        description: 'Congratulations! You\'re now a property owner!',
        status: 'completed'
      }
    ])}

    ${InfoBox(
      'Important Payment Information',
      `
        <p style="margin: 0 0 15px 0;">Your mortgage is now active with the following payment schedule:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Monthly Payment:</strong> ${formatUSD({amount:toNumber( monthlyPayment)})}</li>
          <li><strong>First Payment Due:</strong> ${new Date(firstPaymentDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</li>
          <li><strong>Auto-debit Setup:</strong> Payments will be automatically collected from your account</li>
          <li><strong>Payment Reminders:</strong> You'll receive reminders 3 days before each payment</li>
        </ul>
      `,
      'warning'
    )}

    <div style="text-align: center; margin: 40px 0;">
      ${EmailButton('https://www.usekletch.com/user-dashboard/properties', 'Manage Your Mortgage', 'primary')}
    </div>

     <div style="border-top: 2px solid #e5e7eb; border-bottom: 2px solid #e5e7eb; padding: 30px 0; margin: 40px 0; text-align: center;">
      <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 20px;">
        You Did It!
      </h3>
      <p style="color: #6b7280; font-size: 16px; line-height: 1.7; margin: 0 0 15px 0;">
        From thousands of miles away, you've successfully navigated the complex process of buying property back home. 
        You trusted the process, completed every step, and now you own a piece of home.
      </p>
      <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 0;">
        This is more than just a property, it's your foundation, your investment, and your legacy. 
      </p>
    </div>

    ${InfoBox(
      'We\'re Still Here for You',
      `
        <p style="margin: 0 0 15px 0;">Your journey with Kletch doesn't end here. We're committed to supporting you throughout your property ownership:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Payment Support:</strong> Help with any payment questions or issues</li>
          <li><strong>Property Management:</strong> Connect you with trusted local property managers</li>
          <li><strong>Maintenance Coordination:</strong> Help coordinate any property maintenance needs</li>
          <li><strong>Future Investments:</strong> Priority access to new properties when you're ready to expand</li>
        </ul>
        <p style="margin: 15px 0 0 0;">Questions? Reach us anytime at <a href="mailto:support@usekletch.com" style="color: inherit; font-weight: 600;">support@usekletch.com</a></p>
      `,
      'info'
    )}
  `;
};

export const propertyAcquiredEmail=({
  sellerName,
  propertyName,
  propertyId,
  buyerName,
  saleAmount,
  applicationNumber,
}:PropertyAcquiredParams)=>{
  return `
    ${StatusBadge('success', 'Property Sold!', 'Congratulations on your successful sale')}

    <h2 style="color: #10b981; font-size: 28px; margin: 0 0 10px 0; text-align: center;">
      Congratulations, ${sellerName}!
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear ${sellerName},
    </p>
    
    <p style="color: #4b5563; font-size: 18px; line-height: 1.7; margin: 0 0 30px 0; font-weight: 500;">
      <strong>Fantastic news!</strong> Your property <strong>${propertyName}</strong> has been successfully acquired! 
      A qualified buyer has completed the mortgage process and your property sale is now confirmed.
    </p>

    ${AmountDisplay(formatUSD({amount:toNumber(saleAmount)}), 'Property Sale Value')}


    ${DataTable([
      { label: 'Property Name', value: propertyName },
      { label: 'Property ID', value: propertyId },
      { label: 'Sale Amount', value: formatUSD({amount:toNumber(saleAmount)}), highlight: true },
      { label: 'Buyer', value: buyerName },
      { label: 'Application Number', value: applicationNumber },
      { label: 'Acquisition Date', value: new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) }
    ], 'Sale Summary')}

    ${InfoBox(
      'What This Success Means',
      `
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Guaranteed Sale:</strong> Your buyer is pre-approved with secure mortgage financing</li>
          <li><strong>International Reach:</strong> You've successfully sold to the global diaspora market</li>
          <li><strong>Premium Pricing:</strong> International buyers often pay competitive market rates</li>
          <li><strong>Repeat Success:</strong> You're now part of our successful seller network</li>
          <li><strong>Future Opportunities:</strong> Priority access to list new properties</li>
        </ul>
      `,
      'success'
    )}

    ${Timeline([
      {
        title: 'Property Acquired',
        description: `Buyer completed mortgage process on ${new Date().toLocaleDateString()}`,
        status: 'completed'
      },
      {
        title: 'Down Fund Transfer',
        description: 'Down payment will be wired to your verified account in 3 - 4 working days ',
        status: 'pending'
      },
   
    ])}

    <div style="text-align: center; margin: 40px 0;">
      ${EmailButton(`https://www.usekletch.com/seller-dashboard/listings/${propertyId}`, 'View Sale Details', 'success')}
      ${EmailButton('https://www.usekletch.com/seller-dashboard/transactions', 'Track Payment Status', 'primary')}
    </div>

    <div style="border-top: 2px solid #e5e7eb; border-bottom: 2px solid #e5e7eb; padding: 30px 0; margin: 40px 0; text-align: center;">
      <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 20px;">
         Ready for Your Next Success?
      </h3>
      <p style="color: #6b7280; font-size: 16px; line-height: 1.7; margin: 0 0 15px 0;">
        You've just experienced the power of Kletch's global marketplace. Your property reached qualified international buyers 
        and sold at competitive rates with guaranteed financing.
      </p>
      <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 0;">
        Do you have more properties to list? Let's keep this success going!
      </p>
    </div>

    ${InfoBox(
      'We\'re Here for Your Continued Success',
      `
        <p style="margin: 0 0 15px 0;">Your journey with Kletch continues beyond this sale:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Ongoing Support:</strong> Help with any questions about this sale</li>
          <li><strong>Market Insights:</strong> Regular updates on diaspora market trends</li>
          <li><strong>New Opportunities:</strong> First notification of high-demand locations</li>
          <li><strong>Success Coaching:</strong> Tips to optimize your future listings</li>
        </ul>
        <p style="margin: 15px 0 0 0;">Questions? Contact us anytime at <a href="mailto:support@usekletch.com" style="color: inherit; font-weight: 600;">support@usekletch.com</a></p>
      `,
      'info'
    )}
  `;
};

export const AdminEscrowNotification=({
  amount,
  propertyName,
  transactionID,
  buyerName,
  sellerEmail,
  sellerName,
  sellerID,
  applicationNumber
}:AdminEscrowProps)=>{
  return`
    ${StatusBadge('info', 'Escrow Release Required', 'Mortgage Activation Completed')}


    <h2 style="color: #10b981; font-size: 28px; margin: 0 0 10px 0; text-align: center;">
      Action Required:</strong> Please manually release escrow funds to the seller's account
    </h2>
    
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear Admin,
    </p>
    
    <p style="color: #4b5563; font-size: 18px; line-height: 1.7; margin: 0 0 30px 0; font-weight: 500;">
      A mortgage has been successfully activated, and the escrow funds are now ready to be released to the seller. Please process this payment manually as per the standard procedure.
    </p>

    ${AmountDisplay(amount, 'Escrowed Amount')}

    ${DataTable([
      { label: 'Property Name', value: propertyName },
      { label: 'Application Number', value: applicationNumber },
      { label: 'Transactiion ID', value: transactionID, highlight: true },
      { label: 'Seller Name', value: sellerName },
      { label: 'Seller ID', value: sellerID},
      { label: 'Seller Email', value: sellerEmail },
      { label: 'Buyer Name', value: buyerName }
    ], 'Transaction Details')}
  `
}

export const AdminCOSFailureNotification=({applicationNumber}:{
  applicationNumber:string
})=>{
  return`
    ${StatusBadge('error', 'Contract of Sales Resend', 'Error generating contract of sales document')}

    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
      Dear Admin,
    </p>

    <p style="color: #4b5563; font-size: 18px; line-height: 1.7; margin: 0 0 30px 0; font-weight: 500;">
      Action Required:</strong> Please manually generate contract of sales document for the application id stated below
    </p>

    ${DataTable([
      { label: 'Contract Type', value:'Contract of Sales' },
      { label: 'Application Number', value: applicationNumber, highlight:true },
    ], 'Contract Details')}

  `
}