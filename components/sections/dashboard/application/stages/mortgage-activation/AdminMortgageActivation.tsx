import { ApplicationBase } from "@/type/pages/dashboard/application";
import { DescriptionList } from "@/components/common/DescriptionList";
import { Button } from "@/components/primitives/Button";
import { STAGE_EMPTY_CONFIG } from "@/data/pages/dashboard/application";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";
import { getStaticDocuments } from "@/utils/dashboard/documentHelper";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";
import { Badge } from "@/components/primitives/Badge";

interface MortgageActivationStageProps {
  application: ApplicationBase;
  onActivate: () => void;
  onCreatePlan: () => void;
  onAddStaticDocuments: () => void;
}

export function MortgageActivationStage({ 
  application, 
  onActivate, 
  onCreatePlan, 
  onAddStaticDocuments 
}: MortgageActivationStageProps) {
  const stage = application.stages_completed.mortgage_activation;
  
  if (stage?.status === "upcoming") {
    return <StageDescriptionEmpty {...STAGE_EMPTY_CONFIG[4]} />;
  }

  // Get static documents
  const staticDocuments = getStaticDocuments(stage);
  const hasDocuments = staticDocuments.length > 0;

  const items = [];

  // Documents section
  if (hasDocuments) {
    items.push({
      label: 'Static Documents',
      value: {
        type: 'custom' as const,
        node: (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {staticDocuments.map((doc) => (
                <div key={doc.type} className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{humanizeSnakeCase(doc.type)}</span>
                  <Badge variant="success" size="sm">Uploaded</Badge>
                </div>
              ))}
            </div>
            <Button onClick={onAddStaticDocuments} size='xs' variant="outline">
              Add More Documents
            </Button>
          </div>
        )
      }
    });
  } else {
    items.push({
      label: 'Static Documents',
      value: {
        type: 'custom' as const,
        node: <Button onClick={onAddStaticDocuments} size='xs'>Add Documents</Button>
      }
    });
  }

  // Payment plan section
  items.push({
    label: 'Payment Plan',
    value: {
      type: 'custom' as const,
      node: (
        <Button 
          onClick={onCreatePlan} 
          size='xs' 
          disabled={application.total_payment !== 0}
        >
          {application.total_payment !== 0 ? 'Plan Created' : 'Create Plan'}
        </Button>
      )
    }
  });

  // Mortgage activation button
  items.push({
    label: 'Mortgage Activation',
    value: {
      type: 'custom' as const,
      node: (
        <Button 
          onClick={onActivate} 
          size='xs' 
          disabled={!stage?.data?.direct_debit_status || stage.completed === true}
        >
          {stage?.completed ? 'Mortgage Activated' : 'Activate Mortgage'}
        </Button>
      )
    }
  });

  return (
    <DescriptionList
      title="Mortgage Activation"
      subtitle="User Mortgage Activation Stage"
      items={items}
    />
  );
}