import ErrorState from "@/components/feedbacks/ErrorState";
import { useTransactionalDocuments } from "@/hooks/useSpecialized/useDocuments";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { StageDescriptionEmpty } from "../application/common/StageDescriptionEmpty";
import { DescriptionList } from "@/components/common/DescriptionList";
import { DescriptionListSkeleton } from "@/components/skeleton/DescriptionListSkeleton";
import { formatDocumentFiles } from "@/utils/common/documents";

export default function MortgageDocuments({id}:{id:string}){

  const transactionDocs = useTransactionalDocuments(id);
  
  const { documents, isLoading, error, refetch } = transactionDocs.useAll();

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

  const documentFiles = formatDocumentFiles(documents);

  return(
    <div>

      {!isLoading && documents.length === 0 && (
        <StageDescriptionEmpty
          title="Mortgage Documents List"  
          subtitle="Your Mortgage Documents" 
          message="All Documents attached to your mortgage appear here" 
          Icon={DocumentIcon} 
        />
      )}

      {!isLoading && documents.length > 0 && (
        <DescriptionList
          title="Mortgage Documents"
          subtitle="List Your Mortgage Document"
          items={[
            {
              label: 'Attachments',
              value: {
                type: 'attachments',
                files: documentFiles
              },
            },
          ]}
        />
      )}

    </div>
  )
}