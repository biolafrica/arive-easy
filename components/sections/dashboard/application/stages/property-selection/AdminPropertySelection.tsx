import { ApplicationBase } from "@/type/pages/dashboard/application";
import { formatDate } from "@/lib/formatter";
import { DescriptionList } from "@/components/common/DescriptionList";
import { STAGE_EMPTY_CONFIG } from "@/data/pages/dashboard/application";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";
import { CompleteStageButton } from "../../common/StageActionButton";

interface PropertyStageProps {
  application: ApplicationBase;
  onComplete: () => void;
}

export function PropertyStage({ application, onComplete }: PropertyStageProps) {
  const property = application.stages_completed.property_selection;

  if (property?.status === "upcoming") {
    return <StageDescriptionEmpty {...STAGE_EMPTY_CONFIG[1]} />;
  }

  return (
    <DescriptionList
      title="Property Selection"
      subtitle="User Property Selection Stage"
      items={[
        { label: 'Status', value: { type: 'text', value: `${property?.data?.status || 'No Action Yet'}` }},
        { label: 'Property Name', value: { type: 'text', value: `${property?.data?.property_name || 'No Action Yet'}` }},
        { label: 'Type', value: { type: 'text', value: `${property?.data?.type || 'No Action Yet'}` }},
        { label: 'Date Submitted', value: { type: 'text', value: `${formatDate(property?.data?.submitted_at) || 'No Action Yet'}` }},
        { label: 'Reason', value: { type: 'text', value: `${property?.data?.reason || 'No Action Yet'}` }},
        {
          label: 'Complete Stage',
          value: {
            type: 'custom',
            node: <CompleteStageButton onComplete={onComplete} stageType='property' disabled={property?.completed === true} />
          }
        },
      ]}
    />
  );
}