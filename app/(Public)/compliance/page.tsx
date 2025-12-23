import { LegalHeader } from "@/components/sections/public/legal/LegalHeader";
import { LegalPageLayout } from "@/components/sections/public/legal/LegalPageLayout";
import { LegalSection } from "@/components/sections/public/legal/LegalSection";

export default function CompliancePage() {
  return (
    <LegalPageLayout
      header={
        <LegalHeader
          eyebrow="Safety, Trust & Compliance"
          title="Compliance"
          description="How Ariveasy ensures secure, transparent, and compliant property transactions."
        />
      }
    >
      <LegalSection title="Our Commitment">
        <p>
          At Ariveasy, your security and peace of mind come first. Whether you’re
          buying property, selling a verified home, or partnering as a lender,
          we are committed to delivering a transparent and secure experience
          powered by industry-leading technology and licensed third-party
          providers.
        </p>
      </LegalSection>

      <LegalSection title="1. We Never Hold Customer Funds">
        <p>
          Ariveasy does not accept, store, or move money on your behalf. All
          payments, deposits, fees, and transfers are handled exclusively
          through licensed and regulated third-party providers.
        </p>

        <p className="mt-3">These include:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Stripe (payment processing)</li>
          <li>Licensed escrow partners (funds safeguarding)</li>
          <li>Foreign exchange and cross-border payment providers</li>
          <li>Plaid (identity and bank verification)</li>
        </ul>

        <p className="mt-3 font-medium">
          Your money is always held in secure, regulated financial institutions
          — never by Ariveasy.
        </p>
      </LegalSection>

      <LegalSection title="2. Secure Identity & Document Verification">
        <p>
          To maintain a safe marketplace, Ariveasy uses trusted verification
          tools and licensed partners for identity and document verification.
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Plaid for identity and bank verification</li>
          <li>Approved verification partners for document checks</li>
          <li>E-signature tools for secure and auditable contract signing</li>
        </ul>

        <p className="mt-3">
          Advanced fraud-prevention systems help ensure that buyers, sellers,
          and lenders on the platform are who they claim to be.
        </p>
      </LegalSection>

      <LegalSection title="3. Strict Data Privacy & Protection">
        <p>
          Ariveasy complies with applicable data protection laws and standards,
          including:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>PIPEDA (Canada)</li>
          <li>NDPA (Nigeria)</li>
        </ul>

        <p className="mt-3">
          Your data is encrypted, stored securely, and shared only with verified
          partners involved in your transaction — and only with your consent.
        </p>

        <p className="font-medium">
          We do not sell your data. Ever.
        </p>
      </LegalSection>

      <LegalSection title="4. Verified Sellers & Trusted Property Partners">
        <p>
          Properties listed on Ariveasy undergo screening to reduce fraud and
          improve buyer confidence. We verify:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Seller identity</li>
          <li>Proof of ownership</li>
          <li>Property documentation</li>
          <li>Developer legitimacy (for new developments)</li>
        </ul>

        <p className="mt-3">
          This helps protect buyers from risks such as fake listings, duplicate
          sales, and non-existent properties.
        </p>
      </LegalSection>

      <LegalSection title="5. Transparent Transaction Process">
        <p>
          Every transaction on Ariveasy follows a clear and traceable flow:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Identity verification</li>
          <li>Application submission</li>
          <li>Document review</li>
          <li>Secure agreement signing</li>
          <li>Payment through licensed providers</li>
        </ul>

        <p className="mt-3">
          No hidden steps. No manual back-and-forth. No uncertainty.
        </p>
      </LegalSection>

      <LegalSection title="6. Independent Decision-Making">
        <p>
          Ariveasy is not a lender or real estate developer. Decision-making
          remains fully independent:
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Sellers decide whether to accept or reject offers</li>
          <li>Lenders make independent approval decisions</li>
          <li>Ariveasy facilitates the process using technology only</li>
        </ul>

        <p className="mt-3">
          This structure ensures fairness and prevents conflicts of interest.
        </p>
      </LegalSection>

      <LegalSection title="7. Continuous Compliance Monitoring">
        <p>
          We regularly review and improve our systems to keep pace with evolving
          regulations and emerging risks.
        </p>

        <ul className="list-disc space-y-2 pl-5">
          <li>Security standards</li>
          <li>Partner compliance requirements</li>
          <li>Data protection controls</li>
          <li>Fraud-monitoring rules</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Disclaimer">
        <p>
          Ariveasy does not provide legal, financial, or investment advice.
          Users should consult qualified professionals before making decisions.
        </p>

        <p className="mt-3">
          Ariveasy cannot guarantee approval outcomes, property appreciation,
          third-party performance, or lender decisions. Our role is to
          facilitate — not to underwrite, guarantee, or execute financial
          transactions ourselves.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          If you have compliance-related questions, please contact us at{" "}
          <strong>info@ariveasy.com</strong>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
