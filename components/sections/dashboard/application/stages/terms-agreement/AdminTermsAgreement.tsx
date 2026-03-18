import { ApplicationBase } from "@/type/pages/dashboard/application";
import { DescriptionList } from "@/components/common/DescriptionList";
import { Button } from "@/components/primitives/Button";
import { STAGE_EMPTY_CONFIG } from "@/data/pages/dashboard/application";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";
import { CompleteStageButton } from "../../common/StageActionButton";
import { formatUSD } from "@/lib/formatter";
import { DocumentInfo, getDynamicDocuments } from "@/utils/dashboard/documentHelper";
import { DocumentStatusBadge } from "../../admin/DocumentStageBadge";

interface TermsStageProps {
  application: ApplicationBase;
  onComplete: () => void;
  onAddTerms: () => void;
  onAddDocuments: () => void;
}

export function TermsStage({ 
  application, 
  onComplete, 
  onAddTerms, 
  onAddDocuments 
}: TermsStageProps) {
  const stage = application.stages_completed.terms_agreement;
  
  if (stage?.status === "upcoming") {
    return <StageDescriptionEmpty {...STAGE_EMPTY_CONFIG[2]} />;
  }

  // Get dynamic documents
  const dynamicDocuments = getDynamicDocuments(stage);
  const hasDocuments = dynamicDocuments.length > 0;

  const items = [
    {
      label: 'Terms Details',
      value: {
        type: 'custom' as const,
        node: (
          <Button 
            onClick={onAddTerms} 
            size='xs' 
            disabled={application.approved_loan_amount !== 0}
          >
            Add Terms
          </Button>
        )
      }
    },
    { 
      label: 'Loan Amount', 
      value: { 
        type: 'text' as const, 
        value: `${formatUSD({amount: application.approved_loan_amount}) || 0}` 
      }
    },
    { 
      label: 'Loan Month', 
      value: { 
        type: 'text' as const, 
        value: `${application.loan_term_months || 0} months` 
      }
    },
    { 
      label: 'Loan Interest', 
      value: { 
        type: 'text' as const, 
        value: `${application.interest_rate || 0}%` 
      }
    },
    { 
      label: 'Down Payment Percentage', 
      value: { 
        type: 'text' as const, 
        value: `${application.down_payment_percentage || 0}%` 
      }
    },
  ];

  // Add document section
  if (hasDocuments) {
    items.push({
      label: 'Agreement Documents',
      value: {
        type: 'custom' as const,
        node: (
          <div className="space-y-2">
            {dynamicDocuments.map((doc:DocumentInfo) => (
              <DocumentStatusBadge
                key={doc.type}
                documentType={doc.type}
                status={doc.status}
                signaturesCompleted={doc.signaturesCompleted}
                signaturesTotal={doc.signaturesTotal}
              />
            ))}
            <Button onClick={onAddDocuments} size='xs' variant="outline">
              Add More Documents
            </Button>
          </div>
        )
      }
    });
  } else {
    items.push({
      label: 'Agreement Documents',
      value: {
        type: 'custom' as const,
        node: <Button onClick={onAddDocuments} size='xs'>Add Documents</Button>
      }
    });
  }

  // Complete stage button
  items.push({
    label: 'Complete Stage',
    value: {
      type: 'custom' as const,
      node: (
        <CompleteStageButton 
          onComplete={onComplete} 
          stageType='terms' 
          disabled={stage?.completed === true} 
        />
      )
    }
  });

  return (
    <DescriptionList
      title="Terms Agreement"
      subtitle="User Terms Agreement Stage"
      items={items}
    />
  );
}