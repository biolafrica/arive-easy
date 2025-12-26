'use client'

import { PageContainer } from "@/components/layouts/dashboard/PageContainer"
import DocumentUploadForm from "@/components/sections/dashboard/approval/DocumentUploadForm"
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection"
import { StepProgress } from "@/components/ui/ProgressBar"

export default function UserApprovalDocumentPage(){
  return(
    <PageContainer className="gap-y-4">

      <StepProgress currentStep={4} totalSteps={4} />
      <SettingsSection
        title="Document Upload"
        description="Please upload the following documents to support your mortgage application "
      >
        <DocumentUploadForm/>
      </SettingsSection>
    </PageContainer>
  )
}