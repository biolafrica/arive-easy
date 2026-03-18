import { ApplicationBase } from "@/type/pages/dashboard/application";

export type StageType = 'terms' | 'payment' | 'mortgage' | 'identity' | 'property';

export function useStageTransition(applicationId: string, currentStages: ApplicationBase['stages_completed']) {

  const completeStage = async (type: StageType) => {
    const transitions = {
      identity: {
        StageData:{
          updated_at: new Date().toISOString(),
          overall_status: "approved",
          immigration_status: "approved",
          home_country_status: "approved",
          home_country_verified_at: new Date().toISOString(),
          immigration_verified_at: new Date().toISOString(),
          immigration_error_message: '',
        }
      },

      property: {
        stageData:{
          status: "approved",
          submitted_at: new Date().toISOString(),
          property_name: "Mary Keyes Residence",
          type: "mortgage"
        }
      },

      terms: {
        stageData: null
      },

      payment: {
        stageData: null
      },

      mortgage: {
        stageData:{
          ...currentStages.mortgage_activation?.data,
          current_step: "success",
          direct_debit_status: "active",
          direct_debit_creation_date:new Date().toISOString()
        }
      },

    };
  };

  return { completeStage };
}