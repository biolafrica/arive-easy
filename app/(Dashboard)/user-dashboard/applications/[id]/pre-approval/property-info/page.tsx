import { PageContainer } from "@/components/layouts/dashboard/PageContainer"
import PropertyPreferenceClientView from "@/components/sections/dashboard/approval/PropertyPreferenceClientView"
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection"
import { StepProgress } from "@/components/ui/ProgressBar"

export default async function UserApprovalPropertyPreferencePage({params}:{params:{id:string}}){
  const {id}= await params
  return(
    <PageContainer className="gap-y-4">
      <StepProgress currentStep={3} totalSteps={4} />
      <SettingsSection
        title="Property and Mortgage Preference"
        description="Your property and mortgage preference section"
      >
        <PropertyPreferenceClientView id={id}/>
      </SettingsSection>

    </PageContainer>
  )
}