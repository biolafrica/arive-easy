import { ApplicationBase } from "@/type/pages/dashboard/application";
import { formatDate } from "@/lib/formatter";
import { DescriptionList } from "@/components/common/DescriptionList";
import { STAGE_EMPTY_CONFIG } from "@/data/pages/dashboard/application";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";
import { getbadge } from "../../../listing/SellerPropertyViewTop";
import { CompleteStageButton } from "../../common/StageActionButton";

interface IdentityStageProps {
  application: ApplicationBase;
  onComplete: () => void;
}

export function IdentityStage({ application, onComplete }: IdentityStageProps) {
  const stage = application.stages_completed.identity_verification;
  
  if (stage?.status === "upcoming") {
    return <StageDescriptionEmpty {...STAGE_EMPTY_CONFIG[0]} />;
  }

  const home = stage?.data;
  const immigration = stage?.data;

  return (
    <DescriptionList
      title="Identity Verification"
      subtitle="User Identity Verification Stage"
      items={[
        {
          label: 'Processing Fee',
          value: {
            type: 'custom',
            node: (
              <div className="flex items-center gap-10">
                <h4 className={getbadge(application.processing_fee_payment_status || "upcoming")}>
                  {application.processing_fee_payment_status || "upcoming"}
                </h4>
                <h4>{formatDate(application.processing_fee_payment_date || "")}</h4>
              </div>
            )
          }
        },
        {
          label: 'Home Verification',
          value: {
            type: 'custom',
            node: (
              <div className="flex items-center gap-10">
                <h4 className={getbadge(home?.home_country_status || "upcoming")}>
                  {home?.home_country_status || "upcoming"}
                </h4>
                <h4>{formatDate(home?.home_country_verified_at || '')}</h4>
              </div>
            )
          }
        },
        {
          label: 'Immigration Verification',
          value: {
            type: 'custom',
            node: (
              <div className="flex items-center gap-10">
                <h4 className={getbadge(immigration?.immigration_status || "upcoming")}>
                  {immigration?.home_country_status || "upcoming"}
                </h4>
                <h4>{formatDate(home?.immigration_verified_at || '')}</h4>
              </div>
            )
          }
        },
        {
          label: 'Complete Stage',
          value: {
            type: 'custom',
            node: <CompleteStageButton onComplete={onComplete} stageType='identity' />
          }
        },
      ]}
    />
  );
}