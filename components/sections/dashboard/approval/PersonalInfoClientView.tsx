'use client'

import { PersonalInfoType } from "@/type/pages/dashboard/approval";
import PersonalInfoForm from "./PersonalInfoForm";
import { usePreApprovalStages, usePreApprovalState } from "@/hooks/useSpecialized/usePreApproval";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/utils/skeleton";

export default function PersonalInfoClientView({id}:{id:string}){
  const router = useRouter();
  const { preApproval, isLoading, validateStepAccess} = usePreApprovalState(id);
  const { updatePersonalInfo} = usePreApprovalStages(id);
  const [initialValues, setInitialValues] = useState<PersonalInfoType | null>(null);


  useEffect(() => {
    if (!isLoading && preApproval) {
      const canAccess = validateStepAccess(1);
      
      if (canAccess) {
        setInitialValues({
          first_name: preApproval.personal_info?.first_name || "",
          last_name: preApproval.personal_info?.last_name || "",
          email: preApproval.personal_info?.email || "",
          phone_number: preApproval.personal_info?.phone_number || "",
          date_of_birth: preApproval.personal_info?.date_of_birth || "",
          residence_country: preApproval.personal_info?.residence_country || "",
          marital_status: preApproval.personal_info?.marital_status || "",
          dependant: preApproval.personal_info?.dependant || "",
          visa_status: preApproval.personal_info?.visa_status || ""
        });
      }
    }
  }, [isLoading, preApproval]);

  const handleSubmit = async (values: PersonalInfoType) => {
    await updatePersonalInfo({
      personal_info: values,
      current_step: 2,
      completed_steps: Math.max(preApproval?.completed_steps || 0, 1)
    });
  };
 
  const handleCancel = () => {
    router.push(`/user-dashboard/applications/${id}/pre-approval`);
  };

  if (isLoading || !initialValues) {
    return <Skeleton className="h-96 w-full" />;
  }


  return(
    <div>
      <PersonalInfoForm
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
    </div>
  )
}