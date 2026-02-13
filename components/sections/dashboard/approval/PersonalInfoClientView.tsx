'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth-provider";
import { usePreApprovalStages, usePreApprovalState } from "@/hooks/useSpecialized/usePreApproval";
import { PersonalInfoFormValues, PersonalInfoType } from "@/type/pages/dashboard/approval";
import PersonalInfoForm from "./PersonalInfoForm";
import { Skeleton } from "@/utils/skeleton";
import ErrorState from "@/components/feedbacks/ErrorState";


export default function PersonalInfoClientView({id}:{id:string}){
  const [initialValues, setInitialValues] = useState<PersonalInfoFormValues | null>(null);
  const router = useRouter();
  const { user } = useAuthContext();

  const { preApproval, isLoading, validateStepAccess, error, refresh} = usePreApprovalState(id);

  if (error) {
    return (
      <ErrorState
        message="Error loading your pre-approval personal info"
        retryLabel="Reload personal information data"
        onRetry={refresh}
      />
    );
  }

  const { updatePersonalInfo} = usePreApprovalStages(id);


  useEffect(() => {
    if (!isLoading && preApproval) {
      const canAccess = validateStepAccess(1);
      
      if (canAccess) {
        setInitialValues({
          first_name: preApproval.personal_info?.first_name || "",
          last_name: preApproval.personal_info?.last_name || "",
          email: user?.email || "",
          phone_number: preApproval.personal_info?.phone_number || "",
          date_of_birth: preApproval.personal_info?.date_of_birth || "",
          residence_country: preApproval.personal_info?.residence_country || "",
          marital_status: preApproval.personal_info?.marital_status || "",
          dependant: preApproval.personal_info?.dependant || "",
          visa_status: preApproval.personal_info?.visa_status || "",
          state:preApproval.personal_info.address?.state || "",
          street: preApproval.personal_info.address?.street || "",
          street2: preApproval.personal_info.address?.street2 || "",
          city: preApproval.personal_info.address?.city || "",
          postal_code: preApproval.personal_info.address?.postal_code || "",
          country: preApproval.personal_info.address?.country || "",
        
        });
      }
    }
  }, [isLoading, preApproval]);

  const handleSubmit = async (values:PersonalInfoFormValues) => {
    const personalData:PersonalInfoType = { 
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone_number: values.phone_number,
      date_of_birth: values.date_of_birth,
      residence_country: values.residence_country,
      marital_status: values.marital_status,
      dependant: values.dependant,
      visa_status: values.visa_status,
      address: {
        street: values.street,
        street2: values.street2,
        city: values.city,
        state: values.state,
        postal_code: values.postal_code,
        country: values.residence_country,
      },
    };

    await updatePersonalInfo({
      personal_info: personalData,
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