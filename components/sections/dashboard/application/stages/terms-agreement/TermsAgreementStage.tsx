import { useTransactionalDocuments } from "@/hooks/useSpecialized/useDocuments";
import { ApplicationBase } from "@/type/pages/dashboard/application";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";
import { DocumentIcon } from "@heroicons/react/24/outline";
import UserAgreementDocumentList from "./UsersAgreementDetails";
import ErrorState from "@/components/feedbacks/ErrorState";

interface Props {
  application: ApplicationBase;
  stageData?: any; 
  onUpdate: (data: any) => void;
  isReadOnly: boolean;
  isUpdating: boolean;
}


export default function TermsAgreementStage({ 
  application, 
  stageData,
  onUpdate, 
  isReadOnly,
  isUpdating
}: Props){

  const transactionDocs = useTransactionalDocuments(application.id);
  const { documents, isLoading, error, refetch } = transactionDocs.useAnvil();

  if(isLoading){
    <h4>Document loading</h4>
  }

  if(error){
    return (
      <ErrorState
        message="Error loading documents details"
        retryLabel="Reload application documents data"
        onRetry={refetch}
      />
    );
  }

  return(
    <div>

      {!isLoading && documents.length === 0 && (
        <StageDescriptionEmpty 
          title="Agreement Documents Table"  
          subtitle="Your Application Agreement Document" 
          message="All the Agreement you signed will appear here" 
          Icon={DocumentIcon} 
        />
      )}

      {!isLoading && documents.length > 0 && (
        <UserAgreementDocumentList documents={documents}/>
      )}

    </div>
  )
}