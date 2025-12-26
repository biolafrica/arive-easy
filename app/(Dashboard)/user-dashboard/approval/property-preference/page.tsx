'use client'

import { PageContainer } from "@/components/layouts/dashboard/PageContainer"
import PropertyPreferenceForm from "@/components/sections/dashboard/approval/PropertyPreference"
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection"
import { StepProgress } from "@/components/ui/ProgressBar"

export default function UserApprovalPropertyPreferencePage(){
  return(
    <PageContainer className="gap-y-4">
      <StepProgress currentStep={3} totalSteps={4} />
      <SettingsSection
        title="Property and Mortgage Preference"
        description="Your property and mortgage preference section"
      >
        <PropertyPreferenceForm/>
      </SettingsSection>

    </PageContainer>
  )
}