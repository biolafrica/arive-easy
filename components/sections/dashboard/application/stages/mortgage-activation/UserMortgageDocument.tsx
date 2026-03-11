import { DescriptionList } from "@/components/common/DescriptionList";
import ErrorState from "@/components/feedbacks/ErrorState";
import { DescriptionListSkeleton } from "@/components/skeleton/DescriptionListSkeleton";
import { useTransactionalDocuments } from "@/hooks/useSpecialized/useDocuments";
import { formatDocumentFiles } from "@/utils/common/documents";


export default function UserMortgageDocument({id}:{
  id:string
}){
  const transactionDocs = useTransactionalDocuments(id);
  
  const { documents, isLoading, error, refetch } = transactionDocs.useStatic();

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
      {!isLoading && documents.length > 0 && (
        <DescriptionList
          title="Agreement Documents"
          subtitle="List Of Agreement Documents You Signed"
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