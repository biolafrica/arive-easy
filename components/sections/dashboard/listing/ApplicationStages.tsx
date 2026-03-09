import { DescriptionList } from "@/components/common/DescriptionList";
import ErrorState from "@/components/feedbacks/ErrorState";
import { DescriptionListSkeleton } from "@/components/skeleton/DescriptionListSkeleton";
import { useApplicationByProperty } from "@/hooks/useSpecialized/useApplications"
import { ApplicationBase } from "@/type/pages/dashboard/application";
import { getbadge } from "./SellerPropertyViewTop";

function resolveStageStep(
  stageName: string,
  application: ApplicationBase
): string {
  const { current_stage, stages_completed } = application;

  const stageOrder: ApplicationBase["current_stage"][] = [
    "personal_info",
    "employment_info",
    "property_preferences",
    "documents_upload",
    "identity_verification",
    "property_selection",
    "terms_agreement",
    "payment_setup",
    "mortgage_activation",
  ];

  const displayToKey: Record<string, ApplicationBase["current_stage"]> = {
    offers: "property_selection",
    down_payment: "payment_setup",
    document: "documents_upload",
    final_payment: "mortgage_activation",
    final_documents: "mortgage_activation",
  };

  const key = displayToKey[stageName];
  if (!key) return "upcoming";

  const currentIndex = stageOrder.indexOf(current_stage);
  const targetIndex = stageOrder.indexOf(key);

  if (stages_completed?.[key]?.completed) return "completed";
  if (currentIndex === targetIndex) return "current";
  if (currentIndex > targetIndex) return "completed";
  return "upcoming";
}

export default function ApplicationStages({id}:{id:string}){

  const {application, isLoading, error, refresh} = useApplicationByProperty(id)

  if (error) {
    return (
      <ErrorState
        message="Error loading property application details"
        retryLabel="Reload property application"
        onRetry={refresh}
      />
    );
  }

  if(isLoading){
    <DescriptionListSkeleton rows={6}/>
  }

  if (!application) return null;

  const stages: { label: string; key: string }[] = [
    { label: "Offers Stage", key: "offers" },
    { label: "Down Payment", key: "down_payment" },
    { label: "Document", key: "document" },
    { label: "Final Payment", key: "final_payment" },
    { label: "Final Documents", key: "final_documents" },
  ];


  return(
    <div className="col-span-2 mb-10">
      <DescriptionList
        title="Application Progress"
        subtitle="Application Progress BreakDown"
        items={stages.map(({ label, key }) => {
          const step = resolveStageStep(key, application);
          return {
            label,
            value: {
              type: "custom",
              node: <h4 className={getbadge(step)}>{step}</h4>,
            },
          };
        })}
      />
    </div>
  )

}