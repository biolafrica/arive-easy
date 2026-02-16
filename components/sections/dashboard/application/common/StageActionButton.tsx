import { Button } from '@/components/primitives/Button';

interface CompleteStageButtonProps {
  stageType: 'terms' | 'payment' | 'mortgage' | 'identity' | 'property';
  onComplete: (type: CompleteStageButtonProps['stageType']) => void;
  disabled?: boolean;
  label?: string;
}

export function CompleteStageButton({ 
  stageType,
  onComplete, 
  disabled = false,
  label = 'Complete Stage'
}: CompleteStageButtonProps) {
  return (
    <Button 
      onClick={() => onComplete(stageType)} 
      size='xs'
      disabled={disabled}
    >
      {label}
    </Button>
  );
}

