import { ApplicationBase } from "@/type/pages/dashboard/application";
import { DescriptionList } from "@/components/common/DescriptionList";
import { Button } from "@/components/primitives/Button";
import { STAGE_EMPTY_CONFIG } from "@/data/pages/dashboard/application";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";
import { CompleteStageButton } from "../../common/StageActionButton";
import { formatUSD } from "@/lib/formatter";

interface TermsStageProps {
  application: ApplicationBase;
  onComplete: () => void;
  onAddTerms: () => void;
  onAddDocuments: () => void;
}

export function TermsStage({ application, onComplete, onAddTerms, onAddDocuments }: TermsStageProps) {
  const stage = application.stages_completed.terms_agreement;

  if (stage?.status === "upcoming") {
    return <StageDescriptionEmpty {...STAGE_EMPTY_CONFIG[2]} />;
  }

  return (
    <DescriptionList
      title="Terms Agreement"
      subtitle="User Terms Agreement Stage"
      items={[
        {
          label: 'Terms Details',
          value: {
            type: 'custom',
            node: <Button onClick={onAddTerms} size='xs'>Add Terms</Button>
          }
        },
        { label: 'Loan Amount', value: { type: 'text', value: `${formatUSD({amount:application.approved_loan_amount}) || 0}` }},
        { label: 'Loan Month', value: { type: 'text', value: `${application.loan_term_months || 0 } months` }},
        { label: 'Loan Interest', value: { type: 'text', value: `${(application.interest_rate) || 0 } %`  }},
        { label: 'Down Payment Percentage', value: { type: 'text', value: `${application.down_payment_percentage || 0} %` }},

        {
          label: 'Agreement Documents',
          value: {
            type: 'custom',
            node: <Button onClick={onAddDocuments} size='xs'>Add Documents</Button>
          }
        },
        
        {
          label: 'Complete Stage',
          value: {
            type: 'custom',
            node: <CompleteStageButton onComplete={onComplete} stageType='terms' />
          }
        },
      ]}
    />
  );
}
