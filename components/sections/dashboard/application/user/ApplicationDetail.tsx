import { useState } from "react";

import { useApplicationStageUpdates } from "@/hooks/useSpecialized/useApplications";
import { useApplicationStageManager } from "@/hooks/useApplicationStageManager";
import { ApplicationBase} from "@/type/pages/dashboard/application";
import { ApplicationAccordion } from "../common/ApplicationAccordion";
import { ApplicationStageHeader } from "./ApplicationStageHeader";
import { StepProgress } from "@/components/ui/ProgressBar";
import PersonalInfoStage from "../stages/PersonalInfoStage";
import EmploymentInfoStage from "../stages/EmploymentInfoStage";
import DocumentsStage from "../stages/DocumentsStage";
import PropertySelectionStage from "../stages/property-selection/PropertySelectionStage";
import IdentityVerificationStage from "../stages/verification/IdentityVerificationStage";
import TermsAgreementStage from "../stages/TermsAgreementStage";
import PaymentSetupStage from "../stages/PaymentSetupStage";
import MortgageActivationStage from "../stages/MortgageActivationStage";
import PropertyPreferencesStage from "../stages/PropertyPreferencesStage";



interface Props {
  application: ApplicationBase;
}

export function ApplicationDetails({ application: initialApplication }: Props) {
  
  const [application, setApplication] = useState<ApplicationBase>(initialApplication);

  const { 
    updatePropertySelection, updateIdentityVerification, updateTermsAgreement, updatePaymentSetup, updateMortgageActivation, isUpdating
  } = useApplicationStageUpdates(application);
  
  const { progressData, headerContent, accordionStages, stageStatuses } = useApplicationStageManager(application);
  

  const handleStageUpdate = async (stageKey: string, data: any) => {
    let updatedApplication: ApplicationBase | undefined;
    
    switch (stageKey) {
      case 'identity_verification':
        updatedApplication = await updateIdentityVerification(data);
        break;
      case 'property_selection':
        updatedApplication = await updatePropertySelection(data);
        break;
      case 'terms_agreement':
        updatedApplication = await updateTermsAgreement(data);
        break;
      case 'payment_setup':
        updatedApplication = await updatePaymentSetup(data);
        break;
      case 'mortgage_activation':
        updatedApplication = await updateMortgageActivation(data);
        break;
    }
    
    if (updatedApplication) {
      setApplication(updatedApplication);
    }
  };
  

  const getStageData = (stageKey: string) => {
    const preApprovalStages = ['personal_info', 'employment_info', 'property_preferences', 'documents_upload'];
    
    if (preApprovalStages.includes(stageKey)) {
      switch (stageKey) {
        case 'personal_info':
          return application?.pre_approvals?.personal_info;
        case 'employment_info':
          return application?.pre_approvals?.employment_info;
        case 'property_preferences':
          return application?.pre_approvals?.property_info;
        case 'documents_upload':
          return application?.pre_approvals?.document_info;
      }
    }
    
    // Get from stages_completed for stages 5-9
    return application?.stages_completed?.[stageKey as keyof typeof application.stages_completed]?.data
  };
  
  const renderEditableStage = (stageKey: string) => {
    const props = {
      application,
      stageData: getStageData(stageKey),
      onUpdate: (data: any) => handleStageUpdate(stageKey, data),
      isReadOnly: false,
      isUpdating
    };
    
    switch (stageKey) {
      case 'personal_info':
        return <PersonalInfoStage {...props} />;
      case 'employment_info':
        return <EmploymentInfoStage {...props} />;
      case 'property_preferences':
        return <PropertyPreferencesStage {...props} />;
      case 'documents_upload':
        return <DocumentsStage {...props} />;
      case 'identity_verification':
        return <IdentityVerificationStage {...props} />;
      case 'property_selection':
        return <PropertySelectionStage {...props} />;
      case 'terms_agreement':
        return <TermsAgreementStage {...props} />;
      case 'payment_setup':
        return <PaymentSetupStage {...props} />;
      case 'mortgage_activation':
        return <MortgageActivationStage {...props} />;
      default:
        return <div>Stage not implemented</div>;
    }
  };
  
  const renderReadOnlyStage = (stageKey: string) => {
    const props = {
      application,
      stageData: getStageData(stageKey),
      onUpdate: () => {},
      isReadOnly: true,
      isUpdating: false
    };
    
    return renderEditableStage(stageKey);
  };
  
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      <StepProgress 
        currentStep={progressData.currentStep} 
        totalSteps={progressData.totalSteps} 
        className="mb-8" 
      />
      
      {headerContent && (
        <ApplicationStageHeader
          title={headerContent.title}
          description={headerContent.description}
        />
      )}
      
      {headerContent?.requiresAction && (
        <div className="text-center mb-8">
          <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium">
            {headerContent.actionLabel}
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-border shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Application Number</p>
            <p className="font-medium">{application?.application_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Property</p>
            <p className="font-medium">{application?.properties?.title || 'Not Selected'}</p>
          </div>

        </div>
      </div>
      
      <ApplicationAccordion
        stages={accordionStages}
        renderEditable={renderEditableStage}
        renderReadOnly={renderReadOnlyStage}
      />
    </div>
  );
}