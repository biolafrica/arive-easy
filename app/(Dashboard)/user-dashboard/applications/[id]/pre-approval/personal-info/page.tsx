import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import PersonalInfoClientView from "@/components/sections/dashboard/approval/PersonalInfoClientView";
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection";
import { StepProgress } from "@/components/ui/ProgressBar";

export default async function UserApprovalPersonalInfoPage({params}:{params:{id:string}}){
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