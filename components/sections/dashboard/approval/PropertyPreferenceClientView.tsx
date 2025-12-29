'use client'

import { PropertyPreferenceType } from "@/type/pages/dashboard/approval";
import { usePreApprovalStages, usePreApprovalState } from "@/hooks/useSpecialized/usePreApproval";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/utils/skeleton";
import PropertyPreferenceForm from "./PropertyPreference";

export default function PropertyPreferenceClientView({id}:{id:string}){
  const router = useRouter();
  const { preApproval, isLoading, validateStepAccess} = usePreApprovalState(id);
  const { updatePropertyInfo} = usePreApprovalStages(id);
  const [initialValues, setInitialValues] = useState<PropertyPreferenceType | null>(null);


  useEffect(() => {
    if (!isLoading && preApproval) {
      const canAccess = validateStepAccess(3);
      
      if (canAccess) {
        setInitialValues({
          property_type: preApproval.property_info?.property_type || "",
          property_value: preApproval.property_info?.property_value || "",
          down_payment_amount: preApproval.property_info?.down_payment_amount || "",
          preffered_loan_term: preApproval.property_info?.preffered_loan_term || "",
          other_loan_amount: preApproval.property_info?.other_loan_amount || "",
          existing_mortgage: preApproval.property_info?.existing_mortgage || "",
        });
      }
    }
  }, [isLoading, preApproval]);

  const handleSubmit = async (values: PropertyPreferenceType) => {
    await updatePropertyInfo({
      property_info: values,
      current_step: 4,
      completed_steps: Math.max(preApproval?.completed_steps || 1, 1, 1,)
    });
  };
 
  const handleCancel = () => {
    router.push(`/user-dashboard/applications/${id}/employment-info`);
  };

  if (isLoading || !initialValues) {
    return <Skeleton className="h-96 w-full" />;
  }


  return(
    <div>
      <PropertyPreferenceForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  )
}