import { createMetadata } from "@/components/common/metaData";
import { LegalHeader } from "@/components/sections/public/legal/LegalHeader";
import { LegalPageLayout } from "@/components/sections/public/legal/LegalPageLayout";
import { LegalSection } from "@/components/sections/public/legal/LegalSection";

export const metadata = createMetadata({
  title: "Terms of Service - Kletch",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/terms",
});

export default function TermsPage() {
  return (
    <LegalPageLayout
      header={
        <LegalHeader
          eyebrow="Legal Information"
          title="Terms of Service"
          description="These Terms govern your access to and use of the Kletch platform."
        />
      }
    >
      <LegalSection title="Last Updated">
        <p>16 March 2026</p>
      </LegalSection>

      <LegalSection title="Welcome">
        <p>
          Welcome to Kletch. These Terms of Service (“Terms”) govern your access
          to and use of the Kletch platform and services.
        </p>
        <p>
          By accessing or using Kletch, you agree to be bound by these Terms.
        </p>
      </LegalSection>

      <LegalSection title="1. What Kletch Is">
        <p>
          Kletch is a technology platform that provides tools enabling:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Buyers to submit property applications</li>
          <li>Sellers to list and manage properties</li>
          <li>Lenders to receive and evaluate applications</li>
          <li>All parties to verify documents, communicate, and sign agreements</li>
        </ul>

        <p className="mt-3">
          Kletch provides technology infrastructure that helps coordinate parts
          of the property transaction process.
        </p>

        <p className="mt-3 font-medium">Kletch is not:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>A financial institution</li>
          <li>A mortgage lender</li>
          <li>A real estate brokerage</li>
          <li>A legal adviser</li>
          <li>An escrow agent</li>
          <li>A money transmitter</li>
        </ul>

        <p className="mt-3">
          Kletch does not hold, transmit, or custody funds. All payments and
          financial transfers occur through licensed third-party providers.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility">
        <p>To use Kletch, you must:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Be at least 18 years old</li>
          <li>Be legally capable of entering into binding contracts</li>
          <li>Provide accurate, complete, and truthful information</li>
        </ul>

        <p className="mt-3">
          Providing false, misleading, or incomplete information may result in
          suspension or termination of your account.
        </p>
      </LegalSection>

      <LegalSection title="3. Service Fees">
        <p>
          Kletch may charge certain fees related to the use of the platform,
          which may include:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Processing or document verification fees</li>
          <li>
            Referral or partnership commissions received from lenders, sellers,
            or other partners
          </li>
        </ul>

        <p className="mt-3">
          Kletch does not charge recurring subscription fees or general
          platform access fees.
        </p>

        <p>
          All applicable fees will be disclosed before they are charged.
        </p>
      </LegalSection>

      <LegalSection title="4. User Responsibilities">
        <p>By using the platform, you agree to:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Provide accurate and complete information</li>
          <li>Upload only legitimate and authentic documents</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Not engage in fraud, money laundering, or illegal activities</li>
          <li>Review all agreements carefully before signing</li>
          <li>
            Communicate with lenders, sellers, or other transaction participants
            when required
          </li>
        </ul>

        <p className="mt-3">
          You acknowledge that you are solely responsible for any decision to
          enter into property, financing, or contractual agreements facilitated
          through the platform.
        </p>
      </LegalSection>

      <LegalSection title="5. Third-Party Services">
        <p>
          The Kletch platform may integrate with or rely on third-party service
          providers that assist with services such as:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Identity and document verification</li>
          <li>Electronic signatures</li>
          <li>Payment processing and settlement coordination</li>
          <li>Compliance checks</li>
          <li>Communication tools</li>
          <li>Data hosting and infrastructure</li>
        </ul>

        <p className="mt-3">
          Your use of those services may also be subject to the terms and
          policies of those third parties.
        </p>

        <p>
          Kletch does not control and is not responsible for the availability,
          reliability, or performance of third-party services.
        </p>

        <p>
          Any dispute related to a third-party provider’s services must be
          resolved directly with that provider.
        </p>
      </LegalSection>

      <LegalSection title="6. Real Estate and Transaction Risks">
        <p>
          Kletch does not guarantee the outcome of any property transaction.
        </p>

        <p>Kletch is not responsible for:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Property defects or title issues</li>
          <li>Misrepresentation by sellers or other parties</li>
          <li>Government or regulatory actions</li>
          <li>Mortgage denials or financing failures</li>
          <li>Market conditions affecting property value</li>
          <li>Currency or exchange rate fluctuations</li>
          <li>
            Disputes between buyers, sellers, lenders, or other participants
          </li>
        </ul>

        <p className="mt-3">
          All real estate transactions occur directly between the involved
          parties.
        </p>

        <p>
          Users are responsible for conducting appropriate due diligence and
          obtaining independent legal, financial, or professional advice where
          necessary.
        </p>
      </LegalSection>

      <LegalSection title="7. Electronic Signatures">
        <p>
          Kletch may enable the use of electronic signatures for certain
          documents.
        </p>

        <p>
          By signing documents electronically through the platform, you agree
          that:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Electronic signatures are legally binding</li>
          <li>
            Signed documents may be shared with relevant transaction
            participants
          </li>
          <li>
            Electronic records may be retained as evidence of agreements
          </li>
        </ul>

        <p className="mt-3">
          Kletch does not draft legal agreements and does not provide legal
          advice regarding any document or transaction.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, Kletch will not be
          liable for any indirect, incidental, consequential, or special damages
          arising from the use of the platform.
        </p>

        <p>This includes, but is not limited to, losses related to:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Property transactions</li>
          <li>Financing decisions</li>
          <li>Third-party services</li>
          <li>Data interruptions or service downtime</li>
        </ul>

        <p className="mt-3">
          If Kletch is found liable for any claim, our total liability will not
          exceed the total amount paid directly to Kletch by the user during the
          twelve (12) months preceding the claim.
        </p>
      </LegalSection>

      <LegalSection title="9. Dispute Resolution">
        <p>
          These Terms are governed by the laws of Ontario, Canada, unless
          otherwise required by applicable law.
        </p>

        <p>
          In the event of a dispute arising from the use of the platform, the
          parties agree to attempt to resolve the dispute in good faith through
          discussion.
        </p>

        <p>
          If a dispute cannot be resolved informally, it may be resolved through
          mediation, arbitration, or the courts of competent jurisdiction in
          Ontario, Canada, unless another jurisdiction is required by applicable
          law.
        </p>

        <p>
          To the extent permitted by law, users agree to resolve disputes on an
          individual basis and not as part of a class or representative
          proceeding.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>Kletch may suspend or terminate your account if you:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Provide false or misleading information</li>
          <li>Engage in fraud or unlawful activity</li>
          <li>Violate these Terms</li>
          <li>Use the platform in a manner that creates legal or operational risk</li>
          <li>Are required to be restricted under applicable laws or regulations</li>
        </ul>

        <p className="mt-3">
          Upon termination, access to the platform may be restricted or removed.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to These Terms">
        <p>
          We may update these Terms periodically to reflect changes to the
          platform, legal requirements, or operational practices.
        </p>

        <p>
          When updates are made, the revised Terms will be posted on the website
          with an updated effective date.
        </p>

        <p>
          Your continued use of the platform after changes are published
          constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
