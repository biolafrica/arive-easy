import { createMetadata } from "@/components/common/metaData";
import OnboardingComponent from "@/components/sections/auth/OnboardingPage";

export const metadata = createMetadata({ noIndex: true });

export default function OnboardingPage() {
  return (
    <div>
      <OnboardingComponent />
    </div>
  );
}