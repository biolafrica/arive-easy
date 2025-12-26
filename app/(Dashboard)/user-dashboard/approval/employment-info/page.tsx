"use client"

import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import EmploymentInfoForm from "@/components/sections/dashboard/approval/EmploymentInfoForm";
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection";
import { StepProgress } from "@/components/ui/ProgressBar";

export default function UserApprovalEmploymentInfoPage(){
  return(
    <PageContainer className="gap-y-4">

      <StepProgress currentStep={2} totalSteps={4} />

      <SettingsSection
        title="Employment and Income Information"
        description="Your employement and income Information section"
      >
        <EmploymentInfoForm/>
      </SettingsSection>

    </PageContainer>
  )
}