import { Button } from "../primitives/Button";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export default function ErrorState({
  message = 'Something went wrong',
  onRetry,
  retryLabel = 'Try Again',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <p className="text-red-500 mb-4">{message}</p>

      {onRetry && (
        <Button onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
