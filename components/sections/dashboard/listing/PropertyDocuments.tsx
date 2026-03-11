import { DescriptionList } from "@/components/common/DescriptionList";
import ErrorState from "@/components/feedbacks/ErrorState";
import { DescriptionListSkeleton } from "@/components/skeleton/DescriptionListSkeleton";
import { useSellerTransactionalDocuments } from "@/hooks/useSpecialized/useDocuments"
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { formatDocumentFiles, getEmptyDocumentsMessage } from "@/utils/common/documents";


export default function PropertyDocuments({id}:{id:string}){
  const {documents, isLoading, error, refetch} = useSellerTransactionalDocuments(id)

  if (error) {
    return (
      <ErrorState
        message="Error loading property documents"
        retryLabel="Reload documents"
        onRetry={refetch}
      />
    );
  }


  if (!documents) return null;

  const documentFiles = formatDocumentFiles(documents);
  const emptyState = getEmptyDocumentsMessage(documentFiles.length);

  return(
    <div className="col-span-3 mb-10">
      
      {isLoading && <DescriptionListSkeleton rows={6} />}

      {!isLoading && documents && (
        <DescriptionList
          title="Documents Information"
          subtitle="This Application Documents Uploaded"
          items={[
            {
              label: "Attachments",
              value: {
                type: "attachments",
                files: emptyState.show ? emptyState.files : documentFiles,
              },
            },
          ]}
        />
      )}
    
    </div>
  )
}