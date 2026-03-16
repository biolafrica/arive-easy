import { createMetadata } from "@/components/common/metaData";
import { LegalHeader } from "@/components/sections/public/legal/LegalHeader";
import { LegalPageLayout } from "@/components/sections/public/legal/LegalPageLayout";
import { LegalSection } from "@/components/sections/public/legal/LegalSection";

export const metadata = createMetadata({
  title: "Privacy Policy - Kletch",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/privacy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      header={
        <LegalHeader
          eyebrow="Data Protection"
          title="Privacy Policy"
          description="This Privacy Policy explains how Kletch collects, uses, and protects your personal information."
        />
      }
    >
      <LegalSection title="Last Updated">
        <p>16-March-2026</p>
      </LegalSection>

      <LegalSection title="About Kletch">
        <p>
          Kletch (“Kletch,” “we,” “us,” or “our”) is a federally incorporated
          Canadian company that provides a technology platform enabling
          property buyers, sellers, and lenders to connect, verify documents,
          complete due diligence steps, and execute agreements through
          licensed third-party services.
        </p>
        <p>
          Kletch is not a lender, financial institution, escrow agent, or
          property seller. We do not hold, transmit, or custody funds.
        </p>
      </LegalSection>

      <LegalSection title="1. Information We Collect">
        <p>
          We collect only the information necessary to facilitate
          property-related transactions and verify your identity, eligibility,
          and documentation. Under our minimal data storage model, Kletch
          retains limited information while using licensed third-party
          providers to handle sensitive data.
        </p>

        <h4 className="mt-4 font-semibold">Information You Provide</h4>
        <p>This may include:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Full name, email address, and phone number</li>
          <li>Account registration details and basic profile information</li>
          <li>Employment details (occupation, employer name, income range)</li>
          <li>Property preferences and selected listings</li>
          <li>Correspondence with customer support</li>
          <li>Application metadata (timestamps, status updates, actions taken)</li>
        </ul>

        <h4 className="mt-4 font-semibold">
          Information Processed by Third Parties
        </h4>
        <p>
          Certain sensitive information is collected and processed directly by
          licensed third-party service providers and is not stored by Kletch.
          This may include:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Identity verification information</li>
          <li>Financial account verification</li>
          <li>Credit or background checks</li>
          <li>Payment information</li>
          <li>Escrow and transaction settlement details</li>
        </ul>

        <p className="mt-3">
          Where possible, sensitive documents submitted during verification are
          deleted after the verification process is complete unless retention
          is required by law or operational necessity.
        </p>
      </LegalSection>

      <LegalSection title="2. How We Use Your Information">
        <p>
          We use your information solely for the purposes of operating the
          Kletch platform and facilitating property transactions. These uses
          include:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Creating and managing your user account</li>
          <li>Facilitating property applications and buyer eligibility reviews</li>
          <li>Sharing necessary information with verified partners (such as sellers and lenders)</li>
          <li>Enabling identity verification and document validation</li>
          <li>Facilitating electronic signing of agreements</li>
          <li>Providing customer support and responding to inquiries</li>
          <li>Complying with applicable legal and regulatory obligations</li>
          <li>Improving platform security, reliability, and user experience</li>
        </ul>

        <p className="mt-3 font-medium">
          Kletch does not sell personal data and does not use personal data for
          advertising purposes.
        </p>
      </LegalSection>

      <LegalSection title="3. Sharing of Information">
        <p>
          We share information only when necessary to complete services
          requested by you or to operate the platform.
        </p>

        <p className="mt-3">
          Your information may be shared with the following categories of
          partners:
        </p>

        <ul className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Partner Lenders</strong> – To review and respond to mortgage
            or financing applications.
          </li>
          <li>
            <strong>Partner Sellers or Developers</strong> – To confirm property
            interest, coordinate documentation, or complete property
            transactions.
          </li>
          <li>
            <strong>Third-Party Verification Providers</strong> – Licensed
            service providers that perform identity verification, document
            validation, compliance screening, or other verification processes.
          </li>
          <li>
            <strong>Payment and Settlement Providers</strong> – Licensed payment
            or settlement providers that process payments and coordinate
            transaction disbursements.
          </li>
          <li>
            <strong>Legal and Professional Advisors</strong> – Law firms or
            professional service providers involved in closing or documenting
            property transactions.
          </li>
        </ul>

        <p className="mt-3">
          All third parties receiving data are expected to maintain appropriate
          confidentiality and security safeguards.
        </p>
      </LegalSection>

      <LegalSection title="4. Data Retention">
        <p>Kletch follows a minimal data retention approach.</p>

        <p>
          We retain only information necessary to operate the platform and meet
          legal or contractual obligations. This may include:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Account registration details</li>
          <li>Summarized employment or income information</li>
          <li>Application metadata</li>
          <li>Verification status results (not original verification documents)</li>
          <li>Signed agreements where legally required</li>
        </ul>

        <p className="mt-3">
          Sensitive documents submitted for verification are deleted once
          verification is completed, copies have been transmitted to the
          appropriate partners where required, and retention is no longer
          necessary for legal or operational purposes.
        </p>

        <p>
          You may request deletion of your data at any time unless retention is
          required for fraud prevention, dispute resolution, or legal
          compliance.
        </p>
      </LegalSection>

      <LegalSection title="5. Security">
        <p>
          Kletch implements industry-standard security measures designed to
          protect user data, including:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Encrypted data storage</li>
          <li>Secure HTTPS/TLS data transmission</li>
          <li>Role-based access controls</li>
          <li>Vendor security and compliance assessments</li>
          <li>Ongoing monitoring and internal security reviews</li>
        </ul>

        <p className="mt-3">
          While we take reasonable measures to protect your information, no
          method of electronic transmission or storage can be guaranteed to be
          completely secure.
        </p>

        <p>
          You are responsible for safeguarding your account credentials and
          maintaining the confidentiality of your password.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Request access to the personal data we hold about you</li>
          <li>Request correction of inaccurate or incomplete information</li>
          <li>Request deletion of personal data</li>
          <li>Withdraw consent where processing is based on consent</li>
        </ul>

        <p className="mt-3">
          Requests can be submitted by contacting us at:
          <strong> support@usekletch.com</strong>
        </p>
      </LegalSection>

      <LegalSection title="7. International Data Transfers">
        <p>
          Because Kletch operates across multiple jurisdictions, your data may
          be processed in:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Canada</li>
          <li>The country where the property transaction occurs</li>
          <li>Other jurisdictions where authorized service providers operate</li>
        </ul>

        <p className="mt-3">
          When data is transferred internationally, we take reasonable steps to
          ensure appropriate safeguards are in place consistent with applicable
          privacy laws, including Canada’s Personal Information Protection and
          Electronic Documents Act (PIPEDA).
        </p>
      </LegalSection>

      <LegalSection title="8. Children">
        <p>
          Kletch is not intended for use by individuals under the age of 18. We
          do not knowingly collect personal information from minors.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          our services, regulatory requirements, or operational practices.
        </p>

        <p>
          If we make material changes, the updated policy will be posted on our
          website with a revised effective date. Continued use of the platform
          after updates constitutes acceptance of the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          If you have questions or concerns regarding this Privacy Policy,
          please contact:
        </p>
        <p>
          <strong>support@usekletch.com</strong>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

