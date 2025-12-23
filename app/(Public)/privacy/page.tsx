import { LegalHeader } from "@/components/sections/public/legal/LegalHeader";
import { LegalPageLayout } from "@/components/sections/public/legal/LegalPageLayout";
import { LegalSection } from "@/components/sections/public/legal/LegalSection";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      header={
        <LegalHeader
          eyebrow="Data Protection"
          title="Privacy Policy"
          description="This Privacy Policy explains how Ariveasy collects, uses, and protects your personal information."
        />
      }
    >
      <LegalSection title="Last Updated">
        <p>12 December 2025</p>
      </LegalSection>

      <LegalSection title="About Ariveasy">
        <p>
          Ariveasy (“Ariveasy,” “we,” “us,” or “our”) is a federally incorporated
          Canadian company that provides a technology platform enabling property
          buyers, sellers, and lenders to connect, verify documents, complete
          due-diligence steps, and execute agreements through licensed
          third-party services.
        </p>
        <p>
          Ariveasy is not a lender, financial institution, escrow agent, or
          property seller. We do not hold or transmit money directly.
        </p>
      </LegalSection>

      <LegalSection title="1. Information We Collect">
        <p>
          We collect only the information necessary to facilitate property-related
          transactions and to verify your identity, eligibility, and documentation.
          Under our minimal data storage model, Ariveasy retains limited information
          while using licensed third parties to handle sensitive data.
        </p>

        <h4 className="mt-4 font-semibold">Information You Provide</h4>
        <ul className="list-disc space-y-2 pl-5">
          <li>Full name, email address, and phone number</li>
          <li>Account creation details and basic profile information</li>
          <li>Employment details (occupation, employer name, income range)</li>
          <li>Property preferences and selections</li>
          <li>Correspondence with customer support</li>
          <li>Application metadata (timestamps, statuses, actions taken)</li>
        </ul>

        <h4 className="mt-4 font-semibold">
          Information We Access but Do Not Store
        </h4>
        <p>
          The following information is handled and stored exclusively by licensed
          third-party providers:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Bank verification and account ownership</li>
          <li>Identity verification</li>
          <li>Background checks</li>
          <li>Credit reports</li>
          <li>Payment information</li>
          <li>Escrow details and disbursements</li>
        </ul>

        <p className="mt-3">
          Once verification is complete, Ariveasy deletes any sensitive documents
          not legally or operationally required.
        </p>
      </LegalSection>

      <LegalSection title="2. How We Use Your Information">
        <p>We use your information solely to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Create and manage your user account</li>
          <li>Facilitate property applications</li>
          <li>
            Share necessary data with vetted partners (sellers, lenders, and
            verifiers)
          </li>
          <li>Enable identity and document verification</li>
          <li>Allow electronic signing of contracts</li>
          <li>Provide customer support</li>
          <li>Comply with legal and regulatory obligations</li>
          <li>Improve platform security and user experience</li>
        </ul>

        <p className="mt-3 font-medium">
          We do not sell your data. We do not use your data for advertising.
        </p>
      </LegalSection>

      <LegalSection title="3. Sharing of Information">
        <p>
          We share your information only with trusted and vetted third parties,
          including:
        </p>

        <ul className="list-decimal space-y-2 pl-5">
          <li>
            <strong>Partner Lenders</strong> – to review and respond to your
            application.
          </li>
          <li>
            <strong>Partner Sellers / Developers</strong> – to validate property
            interest or complete a sale.
          </li>
          <li>
            <strong>Third-Party Verification Providers</strong> – services such as
            Plaid and Stripe that receive documents directly from you via secure
            APIs.
          </li>
          <li>
            <strong>Payment Processors</strong> – Stripe and other licensed
            providers handle all payments.
          </li>
          <li>
            <strong>Escrow Providers</strong> – all payments and disbursements
            occur through licensed escrow platforms.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Data Retention">
        <p>Ariveasy retains only minimal necessary data, including:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Account details</li>
          <li>Summarized employment and income information</li>
          <li>Application metadata</li>
          <li>Document verification results (not original documents)</li>
          <li>Signed agreements where legally required</li>
        </ul>

        <p className="mt-3">
          Sensitive documents are deleted once verification is complete, required
          copies have been delivered to partners, and retention is no longer
          required by law.
        </p>

        <p>
          You may request deletion of your data at any time unless retention is
          required for fraud prevention or legal compliance.
        </p>
      </LegalSection>

      <LegalSection title="5. Security">
        <p>Ariveasy employs industry-standard security measures, including:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>SOC 2-compliant encrypted storage</li>
          <li>TLS/SSL encryption</li>
          <li>Role-based access controls</li>
          <li>Third-party vendor risk assessments</li>
          <li>Regular internal security audits</li>
        </ul>

        <p className="mt-3">
          You are responsible for safeguarding your account credentials and
          maintaining the confidentiality of your password.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <p>
          Depending on your jurisdiction, you may request access to, correction
          of, or deletion of your personal data, as well as withdrawal of consent.
        </p>
        <p>
          Requests can be sent to: <strong>info@ariveasy.com</strong>
        </p>
      </LegalSection>

      <LegalSection title="7. International Transfers">
        <p>Your data may be processed in:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Canada</li>
          <li>
            The country in which you are purchasing property (by partner sellers
            or lenders)
          </li>
          <li>The United States (by third-party service providers)</li>
        </ul>

        <p className="mt-3">
          All international transfers comply with PIPEDA requirements for
          cross-border data movement.
        </p>
      </LegalSection>

      <LegalSection title="8. Children">
        <p>
          Ariveasy is not intended for use by individuals under the age of 18.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Continued use of
          the platform constitutes acceptance of the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          If you have any questions or concerns regarding this Privacy Policy,
          please contact us at <strong>info@ariveasy.com</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

