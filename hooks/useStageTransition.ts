import { useUpdateApplication } from "@/hooks/useSpecialized/useApplications";
import { ApplicationBase } from "@/type/pages/dashboard/application";

export type StageType = 'terms' | 'payment' | 'mortgage' | 'identity' | 'property';

export function useStageTransition(applicationId: string, currentStages: ApplicationBase['stages_completed']) {
  const { updateApplication } = useUpdateApplication();

  const completeStage = async (type: StageType) => {
    const transitions = {
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
        // TODO: Implement mortgage activation logic
        stages_completed: currentStages,
        current_stage: 'mortgage_activation' as const,
        current_step: 10,
        successMessage: 'Mortgage activated'
      },

      identity: {
        // TODO: Implement identity verification logic
        stages_completed: currentStages,
        current_stage: 'identity_verification' as const,
        current_step: 1,
        successMessage: 'Identity verification completed'
      },

      property: {
        // TODO: Implement property selection logic
        stages_completed: currentStages,
        current_stage: 'property_selection' as const,
        current_step: 5,
        successMessage: 'Property selection completed'
      },
      
    };

    const transition = transitions[type];
    const { successMessage, ...updateData } = transition;

    await updateApplication(applicationId, updateData, { successMessage });
  };

  return { completeStage };
}