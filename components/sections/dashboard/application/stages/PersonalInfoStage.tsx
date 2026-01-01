import { DescriptionList } from "@/components/common/DescriptionList";
import { ApplicationBase } from "@/type/pages/dashboard/application";

interface Props {
  application: ApplicationBase;
  stageData?: any; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}


export default function PersonalInfoStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props){
  return(
    <div>
      <DescriptionList
        title="Applicant Information"
        subtitle="Personal details and application."
        items={[
          {
            label: 'Full name',
            value: { type: 'text', value: 'Margot Foster' },
          },
          {
            label: 'Application for',
            value: { type: 'text', value: 'Backend Developer' },
          },
          {
            label: 'Email address',
            value: {
              type: 'text',
              value: 'margotfoster@example.com',
            },
          },
          {
            label: 'Salary expectation',
            value: { type: 'text', value: '$120,000' },
          },
          {
            label: 'About',
            value: {
              type: 'paragraph',
              value:
                'Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt...\n\nIrure nostrud pariatur mollit ad adipisicing reprehenderit.',
            },
          },
          {
            label: 'Attachments',
            value: {
              type: 'attachments',
              files: [
                {
                  name: 'resume_back_end_developer.pdf',
                  size: '2.4mb',
                  onDownload: () => {},
                },
                {
                  name: 'coverletter_back_end_developer.pdf',
                  size: '4.5mb',
                  onDownload: () => {},
                },
              ],
            },
          },
        ]}
      />
    </div>
  )
}