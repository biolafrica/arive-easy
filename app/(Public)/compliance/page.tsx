import { LegalHeader } from "@/components/sections/public/legal/LegalHeader";
import { LegalPageLayout } from "@/components/sections/public/legal/LegalPageLayout";
import { LegalSection } from "@/components/sections/public/legal/LegalSection";

export default function CompliancePage() {
  return (
    <LegalPageLayout
      header={
        <LegalHeader
          eyebrow="Regulatory Compliance"
          title="Compliance"
          description="Ariveasy complies with applicable data protection laws, ensuring responsible data handling."
        />
      }
    >
      <LegalSection title="User Consent and Data Collection">
        <p>
          We collect personal data only with your consent and inform you of
          the purpose at the time of collection.
        </p>
      </LegalSection>

      <LegalSection title="Incident Response Protocols">
        <p>
          In the event of a data breach, we notify affected users promptly
          and take corrective actions.
        </p>
        <p>
          Report security concerns to security@ariveasy.com.
        </p>
      </LegalSection>

      <LegalSection title="Continuous Improvement">
        <p>
          We are committed to continually improving our compliance efforts
          and data protection strategies.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
