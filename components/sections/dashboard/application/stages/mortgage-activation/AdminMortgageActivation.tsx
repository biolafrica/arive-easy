import { ApplicationBase } from "@/type/pages/dashboard/application";
import { DescriptionList } from "@/components/common/DescriptionList";
import { Button } from "@/components/primitives/Button";
import { STAGE_EMPTY_CONFIG } from "@/data/pages/dashboard/application";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";

interface MortgageActivationStageProps {
  application: ApplicationBase;
  onActivate: () => void;
  onCreatePlan: () => void;
  onAddStaticDocuments: () => void;
}

export function MortgageActivationStage({ application, onActivate, onCreatePlan, onAddStaticDocuments }: MortgageActivationStageProps) {
  const stage = application.stages_completed.mortgage_activation;

  if (stage?.status === "upcoming") {
    return <StageDescriptionEmpty {...STAGE_EMPTY_CONFIG[4]} />;
  }

  return (
    <DescriptionList
      title="Mortgage Activation"
      subtitle="User Mortgage Activation Stage"
      items={[
        {
          label: 'Agreement Documents',
          value: {
            type: 'custom',
            node: <Button onClick={onAddStaticDocuments} size='xs'>Add Documents</Button>
          }
        },
        {
          label: 'Payment Plan',
          value: {
            type: 'custom',
            node: <Button onClick={onCreatePlan} size='xs' disabled={application.total_payment !== 0}>Create Plan</Button>
          }
        },
        {
          label: 'Mortgage Activation',
          value: {
            type: 'custom',
            node: <Button onClick={onActivate} size='xs' disabled={!stage?.data.direct_debit_status || stage.completed === true}>Activate Mortgage</Button>
          }
        },
      ]}
    />
  );
}