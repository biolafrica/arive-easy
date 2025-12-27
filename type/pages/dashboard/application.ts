export type ApplicationStageStatus = | 'completed' | 'current' | 'upcoming' | 'rejected';

  export interface ApplicationStage {
  step: number;
  key: string;
  title: string;
  status: ApplicationStageStatus;

  completedAt?: string; // ISO date
  errorMessage?: string; // only for rejected stages
}
