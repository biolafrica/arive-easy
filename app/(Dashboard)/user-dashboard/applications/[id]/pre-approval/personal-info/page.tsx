import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import PersonalInfoClientView from "@/components/sections/dashboard/approval/PersonalInfoClientView";
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection";
import { StepProgress } from "@/components/ui/ProgressBar";

export const metadata = createMetadata({
  title: "User Dashboard - Personal and Contact Information",
  description: "Find your perfect home in Nigeria...",
});

export default async function UserApprovalPersonalInfoPage(
  { params }: { params: Promise<{ id: string }> }
){
  const {id}= await params
  
  return(
    <PageContainer className="gap-y-4">

      <StepProgress currentStep={1} totalSteps={4} />

      <SettingsSection
        title="Personal and Contact Information"
        description="Your personal and contact information section"
      >
        <PersonalInfoClientView id={id}/>
      </SettingsSection>

    </PageContainer>
  )
}