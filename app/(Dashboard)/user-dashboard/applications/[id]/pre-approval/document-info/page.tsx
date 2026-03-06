import { createMetadata } from "@/components/common/metaData";
import { PageContainer } from "@/components/layouts/dashboard/PageContainer"
import DocumentInfoClientView from "@/components/sections/dashboard/approval/DocumentInfoClientView"
import { SettingsSection } from "@/components/sections/dashboard/settings/settingsSection"
import { StepProgress } from "@/components/ui/ProgressBar"

export const metadata = createMetadata({
  title: "User Dashboard - Document Upload",
  description: "Find your perfect home in Nigeria...",
});

export default async function UserApprovalDocumentPage(
  { params }: { params: Promise<{ id: string }> }
){
   const {id}= await params
  return(
    <PageContainer className="gap-y-4">

      <StepProgress currentStep={4} totalSteps={4} />
      <SettingsSection
        title="Document Upload"
        description="Please upload the following documents to support your mortgage application "
      >
        <DocumentInfoClientView id={id}/>
      </SettingsSection>
    </PageContainer>
  )
}