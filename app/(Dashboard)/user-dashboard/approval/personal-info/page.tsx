"use client"

import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import PersonalInfoForm from "@/components/sections/dashboard/approval/PersonalInfoForm";
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection";
import { StepProgress } from "@/components/ui/ProgressBar";

export default function UserApprovalPersonalInfoPage(){
  return(
    <PageContainer className="gap-y-4">

      <StepProgress currentStep={1} totalSteps={4} />

      <SettingsSection
        title="Personal and Contact Information"
        description="Your personal and contact information section"
      >
        <PersonalInfoForm/>
      </SettingsSection>

    </PageContainer>
  )
}