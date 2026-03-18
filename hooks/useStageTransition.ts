import { ApplicationBase } from '@/type/pages/dashboard/application';
import { StageType, useStageCompletion } from './useSpecialized/useApplications';


export function useStageTransition(
  applicationId: string,
  currentStages: ApplicationBase['stages_completed']
) {
  const { completeStage: completeStageRequest, isCompleting } = useStageCompletion(applicationId);

  const completeStage = async (type: StageType) => {
    const stageDataMap: Record<StageType, any> = {
      identity: {
        updated_at: new Date().toISOString(),
        overall_status: 'approved',
        immigration_status: 'approved',
        home_country_status: 'approved',
        home_country_verified_at: new Date().toISOString(),
        immigration_verified_at: new Date().toISOString(),
        immigration_error_message: '',
      },

      //FIX LATER
      property: {
        status: "approved",
        submitted_at: new Date().toISOString(),
        property_name: "Mary Keyes Residence",
        type: "mortgage"
      },

      terms: null, 

      payment: null, 

      mortgage: {
        ...currentStages.mortgage_activation?.data,
        current_step: 'success',
        direct_debit_status: 'active',
        direct_debit_creation_date: new Date().toISOString(),
      },
    };

    const stageData = stageDataMap[type];

    await completeStageRequest({
      applicationId,
      stageType: type,
      stageData: stageData || {},
    });

  };

  return {
    completeStage,
    isCompleting,
  };
}