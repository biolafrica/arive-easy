import ErrorState from "@/components/feedbacks/ErrorState";
import { DescriptionListSkeleton } from "@/components/skeleton/DescriptionListSkeleton";
import { useAnvilTransactionalDocuments} from "@/hooks/useSpecialized/useDocuments";
import { StageDescriptionEmpty } from "../../common/StageDescriptionEmpty";
import { DocumentIcon } from "@heroicons/react/24/outline";
import UserAgreementDocumentList from "./UsersAgreementDetails";

export default function AgreementClientView({id}:{id:string}){
  
  const { documents, isLoading, error, refetch } = useAnvilTransactionalDocuments(id);

  if(isLoading){
    return(<DescriptionListSkeleton rows={6}/>)
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