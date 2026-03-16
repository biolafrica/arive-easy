import { createMetadata } from "@/components/common/metaData";
import { LegalHeader } from "@/components/sections/public/legal/LegalHeader";
import { LegalPageLayout } from "@/components/sections/public/legal/LegalPageLayout";
import { LegalSection } from "@/components/sections/public/legal/LegalSection";

export const metadata = createMetadata({
  title: "Compliance - Kletch",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/compliance",
});

export default function CompliancePage() {
  return (
    <LegalPageLayout
      header={
        <LegalHeader
          eyebrow="Safety, Trust & Compliance"
          title="Compliance"
          description="How Kletch ensures secure, transparent, and compliant property transactions."
        />
      }
    >
      <LegalSection title="Our Commitment">
        <p>
          At Kletch, your security and peace of mind come first. Whether you are
          buying property, selling a verified home, or partnering as a lender,
          we are committed to providing a transparent and secure experience
          supported by trusted technology and licensed third-party providers.
        </p>
      </LegalSection>

      <LegalSection title="1. We Never Hold Customer Funds">
        <p>
          Kletch does not accept, store, or move money on your behalf.
        </p>

        <p className="mt-3">
          All payments, deposits, fees, and transfers related to property
          transactions occur exclusively through licensed and regulated
          third-party providers.
        </p>

        <p className="mt-3">These providers may include:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Licensed payment processors</li>
          <li>Escrow and settlement service providers</li>
          <li>Foreign exchange or cross-border payment providers</li>
        </ul>

        <p className="mt-3 font-medium">
          Your funds are always held with regulated financial institutions or
          authorized providers — never by Kletch.
        </p>
      </LegalSection>

      <LegalSection title="2. Secure Identity and Document Verification">
        <p>
          To maintain a safe and trusted marketplace, Kletch uses secure
          verification systems and licensed service providers to confirm user
          identity and validate documentation.
        </p>

        <p className="mt-3">Verification processes may include:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Identity verification checks</li>
          <li>Document authentication and validation</li>
          <li>Compliance and fraud-prevention screening</li>
          <li>Secure electronic signing of agreements</li>
        </ul>

        <p className="mt-3">
          These safeguards help ensure that buyers, sellers, and lenders on the
          platform are properly verified before participating in transactions.
        </p>
      </LegalSection>

      <LegalSection title="3. Data Privacy and Protection">
        <p>
          Kletch complies with applicable data protection and privacy standards,
          including:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>PIPEDA (Canada)</li>
          <li>NDPA (Nigeria) where applicable</li>
        </ul>

        <p className="mt-3">
          Personal information is encrypted, stored securely, and shared only
          with verified partners involved in your transaction when necessary.
        </p>

        <p>
          We follow a minimal data retention model, storing only the information
          required to operate the platform and comply with legal obligations.
        </p>

        <p className="font-medium">
          Kletch does not sell personal data.
        </p>
      </LegalSection>

      <LegalSection title="4. Verified Sellers and Property Screening">
        <p>
          Kletch takes steps to reduce fraud and improve buyer confidence by
          screening property listings and participating sellers.
        </p>

        <p className="mt-3">Verification procedures may include:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Seller identity verification</li>
          <li>Proof of property ownership</li>
          <li>Review of supporting property documentation</li>
          <li>Verification of developers for new construction listings</li>
        </ul>

        <p className="mt-3">
          These checks are intended to reduce risks such as fraudulent listings,
          duplicate sales, or misrepresented properties.
        </p>
      </LegalSection>

      <LegalSection title="5. Transparent Transaction Process">
        <p>
          Property transactions facilitated through Kletch follow a structured
          and traceable process that may include:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>User identity verification</li>
          <li>Application submission</li>
          <li>Document and eligibility review</li>
          <li>Electronic signing of agreements</li>
          <li>Payment coordination through licensed providers</li>
        </ul>

        <p className="mt-3">
          This structured workflow helps ensure that all participants understand
          the steps involved in completing a property transaction.
        </p>
      </LegalSection>

      <LegalSection title="6. Independent Decision-Making">
        <p>
          Kletch is a technology platform and does not make financial or real
          estate decisions on behalf of users.
        </p>

        <p className="mt-3">For example:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Sellers decide whether to accept or reject purchase offers</li>
          <li>Lenders independently evaluate and approve financing applications</li>
          <li>Buyers decide whether to proceed with a property purchase</li>
        </ul>

        <p className="mt-3">
          Kletch provides tools that help facilitate the process but does not
          control transaction outcomes.
        </p>
      </LegalSection>

      <LegalSection title="7. Ongoing Compliance Monitoring">
        <p>
          Kletch continuously reviews and improves its compliance and security
          practices to address evolving risks and regulatory expectations.
        </p>

        <p className="mt-3">These efforts may include:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Security and infrastructure reviews</li>
          <li>Vendor and partner compliance checks</li>
          <li>Data protection assessments</li>
          <li>Fraud monitoring and prevention measures</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Disclaimer">
        <p>
          Kletch does not provide legal, financial, tax, or investment advice.
        </p>

        <p className="mt-3">
          Users should consult qualified professionals before making decisions
          related to property purchases, financing arrangements, or contractual
          agreements.
        </p>

        <p className="mt-3">Kletch does not guarantee:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Mortgage approvals</li>
          <li>Property value appreciation</li>
          <li>Performance of third-party service providers</li>
          <li>Transaction completion or outcomes</li>
        </ul>

        <p className="mt-3">
          Our role is to facilitate connections and workflows between parties,
          not to underwrite, guarantee, or execute financial transactions.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          If you have questions about compliance, security, or regulatory
          matters, please contact us at:
        </p>

        <p>
          <strong>support@usekletch.com</strong>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
