'use client'

import { DocumentInfoType } from "@/type/pages/dashboard/approval";
import { usePreApprovalStages, usePreApprovalState } from "@/hooks/useSpecialized/usePreApproval";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/utils/skeleton";
import DocumentUploadForm from "./DocumentUploadForm";

export default function DocumentInfoClientView({id}:{id:string}){
  const router = useRouter();
  const { preApproval, isLoading, validateStepAccess} = usePreApprovalState(id);
  const { updateDocumentInfo} = usePreApprovalStages(id);
  const [initialValues, setInitialValues] = useState<DocumentInfoType | null>(null);


  useEffect(() => {
    if (!isLoading && preApproval) {
      const canAccess = validateStepAccess(4);
      
      if (canAccess) {
        setInitialValues({
          identity_type: preApproval.document_info?.identity_type|| "",
          identity_proof: preApproval.document_info?.identity_proof|| "",
          payslip_start_date: preApproval.document_info?.payslip_start_date|| "",
          payslip_end_date: preApproval.document_info?.payslip_end_date|| "",
          payslip_image: preApproval.document_info?.payslip_image|| "",
          bank_statement_start_date: preApproval.document_info?.bank_statement_start_date|| "",
          bank_statement_end_date: preApproval.document_info?.bank_statement_end_date|| "",
          bank_statement_image: preApproval.document_info?.bank_statement_image|| "",
          other_document_name: preApproval.document_info?.other_document_name|| "",
          other_document_image:preApproval.document_info?.other_document_image|| ""
        });
      }
    }
  }, [isLoading, preApproval]);

  const handleSubmit = async (values: DocumentInfoType) => {
    await updateDocumentInfo({
      document_info: values,
      current_step: 5,
      completed_steps: Math.max(preApproval?.completed_steps || 1, 1, 1, 1)
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