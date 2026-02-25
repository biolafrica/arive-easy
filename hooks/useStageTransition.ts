import { useUpdateApplication } from "@/hooks/useSpecialized/useApplications";
import { ApplicationBase } from "@/type/pages/dashboard/application";

export type StageType = 'terms' | 'payment' | 'mortgage' | 'identity' | 'property';

export function useStageTransition(applicationId: string, currentStages: ApplicationBase['stages_completed']) {
  const { updateApplication } = useUpdateApplication();

  const completeStage = async (type: StageType) => {
    const transitions = {
      identity: {
        stages_completed: {
          ...currentStages,
          identity_verification:{
            ...currentStages.identity_verification,
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed' as const,
            data:{
              ...currentStages.identity_verification?.data,
              updated_at: new Date().toISOString(),
              overall_status: "approved",
              immigration_status: "approved",
              home_country_status: "approved",
              home_country_verified_at: new Date().toISOString(),
              immigration_verified_at: new Date().toISOString(),
            }
          },
          property_selection:{
            status: 'current' as const,
            completed: false,
          }
        },

        processing_fee_payment_status: "paid",
        processing_fee_payment_date:new Date().toISOString(),
        kyc_verified_at: new Date().toISOString(),
        current_stage: 'property_selection' as const,
        current_step: 6,
        successMessage: 'Identity verification completed'
      },

      property: {
        stages_completed: {
          ...currentStages,
          property_selection:{
            ...currentStages.property_selection,
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed' as const,
            data:{
              ...currentStages.property_selection?.data,
              status: "approved",
              submitted_at: new Date().toISOString(),
              property_name: "Mary Keyes Residence",
              type: "mortgage"
            }
          },
          terms_agreement:{
            status: 'current' as const,
            completed: false,
          }
        },
        current_stage: 'terms_agreement' as const,
        current_step: 7,
        successMessage: 'Property selection completed'
      },

      terms: {
        stages_completed: {
          ...currentStages,
          terms_agreement: {
            ...currentStages.terms_agreement,
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed' as const,
          },
          payment_setup: {
            status: 'current' as const,
            completed: false,
          }
        },
        current_stage: 'payment_setup' as const,
        current_step: 8,
        successMessage: 'Completed terms and agreement stage'
      },

      payment: {
        stages_completed: {
          ...currentStages,
          payment_setup: {
            ...currentStages.payment_setup,
            completed: true,
            completed_at: new Date().toISOString(),
            status: 'completed' as const,
            data:{
              ...currentStages.payment_setup?.data,
            }
          },
          mortgage_activation: {
            status: 'current' as const,
            completed: false,
          }
        },
        current_stage: 'mortgage_activation' as const,
        current_step: 9,
        successMessage: 'Completed payment setup stage'
      },

      mortgage: {
        stages_completed: {
          ...currentStages,
          mortgage_activation:{
            ...currentStages.mortgage_activation,
            completed:true,
            completed_at: new Date().toISOString(),
            status: 'completed' as const,
            data:{
              ...currentStages.mortgage_activation?.data,
              current_step: "success",
              direct_debit_status: "active",
              direct_debit_creation_date:new Date().toISOString()
            }
          },
        },
        direct_debit_status: 'active',
        status:'active',
        current_stage: 'mortgage_activation' as const,
        current_step: 9,
        successMessage: 'Mortgage activated'
        
      },

    };

    const transition = transitions[type];
    console.log('transitions', transition)
    const { successMessage, ...updateData } = transition;
    console.log("success message", successMessage)
    console.log("data", updateData)

    await updateApplication(applicationId, updateData, { successMessage });
  };

  return { completeStage };
}