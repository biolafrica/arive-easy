'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePreApprovalStages, usePreApprovalState } from "@/hooks/useSpecialized/usePreApproval";
import { DocumentInfoTypes, } from "@/type/pages/dashboard/approval";
import { Skeleton } from "@/utils/skeleton";
import DocumentUploadForm from "./DocumentUploadForm";
import ErrorState from "@/components/feedbacks/ErrorState";

export default function DocumentInfoClientView({id}:{id:string}){
  const router = useRouter();
  const { preApproval, isLoading, validateStepAccess, error, refresh} = usePreApprovalState(id);

  if (error) {
    return (
      <ErrorState
        message="Error loading your pre-approval document info"
        retryLabel="Reload document data"
        onRetry={refresh}
      />
    );
  }

  const { updateDocumentInfo} = usePreApprovalStages(id);
  const [initialValues, setInitialValues] = useState<DocumentInfoTypes | null>(null);


  useEffect(() => {
    if (!isLoading && preApproval) {
      const canAccess = validateStepAccess(4);
      
      if (canAccess) {
        setInitialValues({
          pay_stubs: preApproval.document_info?.pay_stubs || '',
          tax_returns: preApproval.document_info?.tax_returns || '',
          bank_statements: preApproval.document_info?.bank_statements || '',
          employment_verification: preApproval.document_info?.employment_verification || '',
        });
      }
    }
  }, [isLoading, preApproval]);

  const handleSubmit = async (values: DocumentInfoTypes) => {
    await updateDocumentInfo({
      document_info: values,
      current_step: 5,
      completed_steps: 4,
      is_complete:true,
      status:"pending",
    });
  };
 
  const handleCancel = () => {
    router.push(`/user-dashboard/applications/${id}/pre-approval/property-info`);
  };

  if (isLoading || !initialValues) {
    return <Skeleton className="h-96 w-full" />;
  }


  return(
    <div>
      <DocumentUploadForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  )
}