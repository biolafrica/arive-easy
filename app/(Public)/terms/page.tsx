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
          description="Learn how Ariveasy safeguards your information and governs platform usage."
        />
      }
    >
      <LegalSection title="Account Registration and Use">
        <p>
          Registration is required to access certain features. You are
          responsible for maintaining account security.
        </p>
      </LegalSection>

      <LegalSection title="Content Ownership and Rights">
        <p>
          You retain rights to your content but grant Ariveasy a license
          to use and display it.
        </p>
      </LegalSection>

      <LegalSection title="Governing Law">
        <p>
          These Terms are governed by the laws of the Federal Republic of Nigeria.
        </p>
        <p>
          For inquiries, contact support@ariveasy.com.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
