import { ApplicationAccordion } from "./ApplicationAccordion";
import EmploymentInfoForm from "../approval/EmploymentInfoForm";
import PropertyPreferenceForm from "../approval/PropertyPreference";
import PersonalInfoForm from "../approval/PersonalInfoForm";
import { APPLICATION_STAGES } from "@/data/pages/dashboard/application";
import { StepProgress } from "@/components/ui/ProgressBar";
import { ApplicationStageHeader } from "./ApplicationStageHeader";

export default function ApplicationDetails(){

  return(
    <div className="gap-y-4">

      <StepProgress currentStep={3} totalSteps={8} className="mb-8" />

      <ApplicationStageHeader
        title='Developer Review'
        description='The property developer is reviewing your application and confirming availability and terms.'
      />


      <ApplicationAccordion
        stages={APPLICATION_STAGES}
        renderEditable={(key) => {
          switch (key) {
            case 'employment_income':
              return <EmploymentInfoForm />;
            case 'property_details':
              return <PropertyPreferenceForm />;
            default:
              return null;
          }
        }}
        renderReadOnly={(key) => {
          switch (key) {
            case 'personal_details':
              return <PersonalInfoForm />;
            default:
              return <p className="text-sm text-secondary">No changes allowed.</p>;
          }
        }}
      />

    </div>
  )
}