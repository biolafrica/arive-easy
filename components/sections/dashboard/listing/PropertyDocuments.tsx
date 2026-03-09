import { DescriptionList } from "@/components/common/DescriptionList";
import ErrorState from "@/components/feedbacks/ErrorState";
import { DescriptionListSkeleton } from "@/components/skeleton/DescriptionListSkeleton";
import { useSellerTransactionalDocuments } from "@/hooks/useSpecialized/useDocuments"
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";


function resolveDocumentFiles(
  documents: TransactionDocumentBase[]
): { name: string; url: string }[] {
  return documents
    .filter((doc) => typeof doc.generated_document_url === "string" && doc.generated_document_url)
    .map((doc) => ({
      name: doc.document_type,
      url: doc.generated_document_url as string,
    }));
}

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

  const documentFiles = resolveDocumentFiles(documents);

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
                files: documentFiles.length > 0
                  ? documentFiles
                  : [{ name: "No documents available", url: "" }],
              },
            },
          ]}
        />
      )}
    
    </div>
  )
}