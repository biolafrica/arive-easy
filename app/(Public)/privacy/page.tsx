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
          description="Read about how Ariveasy protects your data and respects your privacy."
        />
      }
    >
      <LegalSection title="Information We Collect">
        <p>
          We gather data to enhance user experience and offer personalized
          services. This includes information you provide directly and data
          collected automatically such as browsing activity.
        </p>
        <p>
          We use advanced security measures to protect your data and comply
          with applicable data protection regulations.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Your Information">
        <p>
          Your data helps us improve our services, personalize your experience,
          and provide tailored recommendations.
        </p>
        <p>
          We adhere to global data protection standards including GDPR and CCPA.
        </p>
      </LegalSection>

      <LegalSection title="Keeping Your Information Accurate">
        <p>
          You have the right to access, modify, or delete your personal data
          at any time.
        </p>
        <p>
          For privacy inquiries, contact us at feedback@ariveasy.com.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
