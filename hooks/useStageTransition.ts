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

      property: {
        status: 'sent', // This triggers offer creation
        submitted_at: new Date().toISOString(),
        property_name: currentStages.property_selection?.data?.property_name || 'Property',
        type: 'mortgage',
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

    try {
      const result = await completeStageRequest({
        applicationId,
        stageType: type,
        stageData: stageData || {},
      });

      return result;
    } catch (error) {
      // Error already handled by useStageCompletion
      throw error;
    }
  };

  return {
    completeStage,
    isCompleting,
  };
}