import { DescriptionList } from "@/components/common/DescriptionList";
import ErrorState from "@/components/feedbacks/ErrorState";
import { useTransactionalDocuments } from "@/hooks/useSpecialized/useDocuments";
import { TransactionDocumentBase } from "@/type/pages/dashboard/documents";
import { humanizeSnakeCase } from "@/utils/common/humanizeSnakeCase";

export const files =(documents:TransactionDocumentBase[])=>{
  const files = (documents).map((item: TransactionDocumentBase)=>(
    item.document_type && { 
      name: humanizeSnakeCase(item.document_type), 
      url: item.generated_document_url
    }
  )).filter(Boolean) as { name: string; url: string }[];

  return files
}

export default function UserMortgageDocument({id}:{
  id:string
}){
  const transactionDocs = useTransactionalDocuments(id);
  const { documents, isLoading, error, refetch } = transactionDocs.useStatic();

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
      {!isLoading && documents.length > 0 && (
        <DescriptionList
          title="Agreement Documents"
          subtitle="List Of Agreement Documents You Signed"
          items={[
            {
              label: 'Attachments',
              value: {
                type: 'attachments',
                files: files(documents)
              },
            },
          ]}
        />
      )}
    </div>
  )
}