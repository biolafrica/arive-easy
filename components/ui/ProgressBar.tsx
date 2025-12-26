import { cn } from '@/lib/utils';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepProgress({
  currentStep,
  totalSteps,
  className,
}: StepProgressProps) {
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-10',
        className
      )}
    >
      <p className="text-sm font-medium text-heading">
        Step {currentStep} of {totalSteps}
      </p>

      <div className="flex items-center gap-3">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <span
              key={step}
              className={cn(
                'h-3 w-3 rounded-full transition-all duration-300',
                isActive && 'bg-btn-secondary ring-4 ring-secondary/20',
                isCompleted && 'bg-btn-secondary',
                !isActive && !isCompleted && 'bg-gray-300'
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
