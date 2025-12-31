import { STAGE_CONFIGURATIONS } from '@/data/pages/dashboard/applicationStages';
import { ApplicationBase, ApplicationStageKey, ApplicationStageStatus, StageStatus } from '@/type/pages/dashboard/application';
import { useState, useEffect, useMemo } from 'react';


export function useApplicationStageManager(application: ApplicationBase | null) {
  const [currentStage, setCurrentStage] = useState<number>(5);
  const [stageStatuses, setStageStatuses] = useState<Record<ApplicationStageKey, StageStatus>>({
    personal_info: 'completed',
    employment_info: 'completed',
    property_preferences: 'completed',
    documents_upload: 'completed',
    property_selection: 'current',
    identity_verification: 'upcoming',
    terms_agreement: 'upcoming',
    payment_setup: 'upcoming',
    mortgage_activation: 'upcoming',
  });
  
  // Calculate stage statuses based on application data
  useEffect(() => {
    if (!application) return;
    
    const statuses: Record<ApplicationStageKey, StageStatus> = {} as any;
    let foundCurrent = false;
    
    STAGE_CONFIGURATIONS.forEach((config) => {
      const stageData = application.stages_completed?.[config.key];
      
      if (stageData?.completed) {
        statuses[config.key] = stageData.error_message ? 'rejected' : 'completed';
      } else if (application.current_stage === config.key || (!foundCurrent && !stageData?.completed)) {
        statuses[config.key] = 'current';
        foundCurrent = true;
        setCurrentStage(config.step);
      } else if (foundCurrent) {
        statuses[config.key] = 'upcoming';
      } else {
        // Check if this is a pre-approval stage (1-4) that should be completed
        if (config.step <= 4 && application.pre_approvals) {
          statuses[config.key] = 'completed';
        } else {
          statuses[config.key] = 'upcoming';
        }
      }
    });
    
    setStageStatuses(statuses);
  }, [application]);
  


  // Get display data for progress bar
  const progressData = useMemo(() => {
    if (!application) return { currentStep: 1, totalSteps: 9 };
    
    // Find the highest completed step
    let highestCompleted = 0;
    STAGE_CONFIGURATIONS.forEach((config) => {
      if (stageStatuses[config.key] === 'completed') {
        highestCompleted = Math.max(highestCompleted, config.step);
      }
    });
    
    // Current step is either the current stage or highest completed + 1
    const currentStep = stageStatuses[application.current_stage as ApplicationStageKey] === 'current' 
      ? STAGE_CONFIGURATIONS.find(c => c.key === application.current_stage)?.step || highestCompleted + 1
      : highestCompleted + 1;
    
    return {
      currentStep,
      totalSteps: 9
    };
  }, [application, stageStatuses]);
  


  // Get header content based on current stage
  const headerContent = useMemo(() => {
    const config = STAGE_CONFIGURATIONS.find(c => c.step === currentStage);
    if (!config) return null;
    
    // Check if action is needed
    const needsAction = config.requiresAction && stageStatuses[config.key] === 'current';
    
    return {
      title: config.title,
      description: config.description,
      requiresAction: needsAction,
      actionLabel: config.actionLabel
    };
  }, [currentStage, stageStatuses]);
  


  // Transform data for accordion
  const accordionStages = useMemo(() => {
    return STAGE_CONFIGURATIONS.map(config => ({
      step: config.step,
      key: config.key,
      title: config.title,
      status: (stageStatuses[config.key] === 'in_progress' 
      ? 'current' 
      : stageStatuses[config.key]) as ApplicationStageStatus || 'upcoming',
      completedAt: application?.stages_completed?.[config.key as keyof typeof application.stages_completed]?.completed_at,
      errorMessage: application?.stages_completed?.[config.key as keyof typeof application.stages_completed]?.error_message,
    }));
  }, [application, stageStatuses]);
  

  
  return {
    currentStage,
    progressData,
    headerContent,
    accordionStages,
    stageStatuses,
  };
}