"use client"

import { PageContainer } from "@/components/layouts/dashboard/PageContainer";
import EmploymentInfoClientView from "@/components/sections/dashboard/approval/EmploymentInfoClientView";
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection";
import { StepProgress } from "@/components/ui/ProgressBar";

export default async function UserApprovalEmploymentInfoPage({params}:{params:{id:string}}){
   const {id}= await params
  return(
    <PageContainer className="gap-y-4">

      <StepProgress currentStep={2} totalSteps={4} />

      <SettingsSection
        title="Employment and Income Information"
        description="Your employement and income Information section"
      >
        <EmploymentInfoClientView id={id}/>
      </SettingsSection>

    </PageContainer>
  )
}