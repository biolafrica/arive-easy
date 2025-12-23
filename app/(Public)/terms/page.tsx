import { LegalHeader } from "@/components/sections/public/legal/LegalHeader";
import { LegalPageLayout } from "@/components/sections/public/legal/LegalPageLayout";
import { LegalSection } from "@/components/sections/public/legal/LegalSection";

export default function TermsPage() {
  return (
    <LegalPageLayout
      header={
        <LegalHeader
          eyebrow="Legal Information"
          title="Terms of Service"
          description="These Terms govern your access to and use of the Ariveasy platform."
        />
      }
    >
      <LegalSection title="Last Updated">
        <p>12 December 2025</p>
      </LegalSection>

      <LegalSection title="Welcome">
        <p>
          Welcome to Ariveasy. These Terms of Service (“Terms”) govern your use of
          the Ariveasy platform. By accessing or using Ariveasy, you agree to be
          bound by these Terms.
        </p>
      </LegalSection>

      <LegalSection title="1. What Ariveasy Is">
        <p>
          Ariveasy is a technology platform that provides tools enabling:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Buyers to submit property applications</li>
          <li>Sellers to list and manage properties</li>
          <li>Lenders to receive and evaluate applications</li>
          <li>
            All parties to verify documents, communicate, and sign agreements
          </li>
        </ul>

        <p className="mt-3 font-medium">
          Ariveasy is not:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>A financial institution</li>
          <li>A mortgage lender</li>
          <li>A real estate brokerage</li>
          <li>A legal adviser</li>
          <li>An escrow agent</li>
          <li>A money transmitter</li>
        </ul>

        <p className="mt-3">
          All payments occur exclusively through licensed third-party providers.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>To use Ariveasy, you must:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Be at least 18 years old</li>
          <li>Be legally capable of entering binding contracts</li>
          <li>Provide accurate and truthful information</li>
        </ul>

        <p className="mt-3">
          Misrepresentation or false information may result in suspension or
          termination of your account.
        </p>
      </LegalSection>

      <LegalSection title="3. Service Fees">
        <p>Ariveasy may charge:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Processing fees (e.g., document verification)</li>
          <li>Referral commissions from lenders or sellers</li>
        </ul>

        <p className="mt-3">
          Ariveasy does not charge monthly subscriptions or platform access fees.
          All applicable fees are disclosed at the point of use.
        </p>
      </LegalSection>

      <LegalSection title="4. User Responsibilities">
        <p>You agree to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide accurate and complete information</li>
          <li>Not upload fraudulent or misleading documents</li>
          <li>
            Not engage in money laundering, fraud, or illegal activities
          </li>
          <li>Review all agreements before signing</li>
          <li>
            Communicate directly with lenders and sellers as required
          </li>
        </ul>

        <p className="mt-3">
          You assume full responsibility for any decision to enter into property,
          lending, or financial agreements.
        </p>
      </LegalSection>

      <LegalSection title="5. Third-Party Services">
        <p>Ariveasy integrates with third-party providers including:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Plaid (bank and identity verification)</li>
          <li>Stripe (payment processing)</li>
          <li>Foreign exchange platforms (cross-border payments)</li>
          <li>Escrow providers (holding deposits and down payments)</li>
          <li>Supabase (data storage)</li>
        </ul>

        <p className="mt-3">
          Your use of Ariveasy is also subject to the terms and policies of these
          third parties.
        </p>

        <p>
          Ariveasy is not responsible for service interruptions, errors, or losses
          caused by third-party providers.
        </p>
      </LegalSection>

      <LegalSection title="6. No Liability for Real Estate Risks">
        <p>Ariveasy is not liable for:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Property or title defects</li>
          <li>Fraud committed by sellers or third parties</li>
          <li>Government or regulatory actions</li>
          <li>Market risks or failed mortgage approvals</li>
          <li>Exchange rate fluctuations</li>
          <li>
            Disputes between buyers, sellers, lenders, or other parties
          </li>
        </ul>

        <p className="mt-3">
          All real estate transactions occur directly between the involved
          parties.
        </p>
      </LegalSection>

      <LegalSection title="7. Electronic Signatures">
        <p>
          By signing documents through Ariveasy, you agree that electronic
          signatures are legally binding and authorize the sharing of agreements
          with relevant parties.
        </p>

        <p>
          Ariveasy does not draft, interpret, or provide legal advice regarding
          any agreement.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, Ariveasy is not liable for any
          indirect, incidental, or consequential damages.
        </p>

        <p>
          Our total liability is limited to the amount you paid to Ariveasy in the
          twelve (12) months preceding the claim.
        </p>

        <p>Class action lawsuits are waived.</p>
      </LegalSection>

      <LegalSection title="9. Dispute Resolution">
        <p>
          These Terms are governed by the laws of Canada. All disputes must be
          resolved through binding arbitration in Ontario, Canada.
        </p>

        <p>
          You waive the right to participate in class actions or representative
          proceedings.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          We may suspend or terminate your account if you:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide false or misleading information</li>
          <li>Engage in fraud or illegal activities</li>
          <li>Violate these Terms</li>
          <li>Are required to do so by law</li>
        </ul>
      </LegalSection>

      <LegalSection title="11. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Continued use of the
          platform indicates acceptance of the updated Terms.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
