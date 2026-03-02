import ErrorState from "@/components/feedbacks/ErrorState";
import { DescriptionListSkeleton } from "@/components/skeleton/DescriptionListSkeleton";
import { useTransactionalDocuments } from "@/hooks/useSpecialized/useDocuments";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";
import { DocumentIcon } from "@heroicons/react/24/outline";
import UserAgreementDocumentList from "./UsersAgreementDetails";

export default function AgreementClientView({id}:{id:string}){
  const transactionDocs = useTransactionalDocuments(id);
  const { documents, isLoading, error, refetch } = transactionDocs.useAnvil();

  if(isLoading){
    <DescriptionListSkeleton rows={6}/>
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