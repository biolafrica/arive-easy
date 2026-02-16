import { useState } from "react";
import { useConfirmAction } from "@/hooks/useConfirmation";
import { useStageTransition } from "@/hooks/useStageTransition";
import { ApplicationBase,  } from "@/type/pages/dashboard/application";
import { StepProgress } from "@/components/ui/ProgressBar";
import { confirmConfig } from "@/data/pages/dashboard/application";
import ConfirmBanner from "@/components/feedbacks/ConfirmBanner";

import { IdentityStage } from "../stages/verification/AdminIdentityVerification";
import { PropertyStage } from "../stages/property-selection/AdminPropertySelection";
import { TermsStage } from "../stages/terms-agreement/AdminTermsAgreement";
import { PaymentStage } from "../stages/payment-setup/AdminPaymentStage";

import AddPayment from "./AddPayment";
import AddDocuments from "./AddDocuments";
import AddTerms from "./AddTerms";
import CreatePlan from "./CreatePlan";
import { MortgageActivationStage } from "../stages/mortgage-activation/AdminMortgageActivation";

interface Props {
  applications: ApplicationBase;
}

export default function AdminPreMortgageDetails({ applications }: Props) {
  const [paymentShowModal, setPaymentShowModal] = useState(false);
  const [documentShowModal, setDocumentShowModal] = useState(false);
  const [termShowModal, setTermShowModal] = useState(false);
  const [planShowModal, setPlanShowModal] = useState(false);

  const { completeStage } = useStageTransition(applications.id, applications.stages_completed);
  const { open, banner, openConfirm, closeConfirm } = useConfirmAction(confirmConfig, completeStage);

  const getStep=()=>{
    switch (applications.current_stage) {
      case 'identity_verification': return 1;
      case 'property_selection': return 2;
      case 'terms_agreement': return 3
      case 'payment_setup': return 4
      case 'mortgage_activation': return 5
      default: return 1
    }
  }

  return (
    <>
      <div>
        <StepProgress
          currentStep={getStep()}
          totalSteps={5}
          className="mb-8"
        />

        <div className="space-y-5 mt-5">
          <IdentityStage
            application={applications}
            onComplete={() => openConfirm('identity')}
          />

          <PropertyStage
            application={applications}
            onComplete={() => openConfirm('property')}
          />

          <TermsStage
            application={applications}
            onComplete={() => openConfirm('terms')}
            onAddTerms={() => setTermShowModal(true)}
            onAddDocuments={() => setDocumentShowModal(true)}
          />

          <PaymentStage
            application={applications}
            onComplete={() => openConfirm('payment')}
            onAddPayments={() => setPaymentShowModal(true)}
          />

          <MortgageActivationStage
            application={applications}
            onActivate={() => openConfirm('mortgage')}
            onCreatePlan={() => setPlanShowModal(true)}
          />
        </div>
      </div>

      <AddPayment showModal={paymentShowModal} setShowModal={setPaymentShowModal} id={applications.id} />
      <AddDocuments showModal={documentShowModal} setShowModal={setDocumentShowModal} />
      <AddTerms showModal={termShowModal} setShowModal={setTermShowModal} id={applications.id} />
      <CreatePlan showModal={planShowModal} setShowModal={setPlanShowModal} id={applications.id} />

      {banner && (
        <ConfirmBanner
          open={open}
          title={banner.title}
          message={banner.message}
          variant={banner.variant}
          onConfirm={banner.confirm}
          onCancel={closeConfirm}
        />
      )}
    </>
  );
}

