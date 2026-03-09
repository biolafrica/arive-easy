import { Button } from "../primitives/Button";
import { XCircleIcon, ArrowPathIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";


type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onContactSupport?: () => void;
  supportEmail?: string;
  className?: string;
};

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again or contact support if the problem persists.",
  onRetry,
  retryLabel = 'Try Again',
  onContactSupport,
  supportEmail ="support@usekletch.com",
  className = "",
}: ErrorStateProps) {

  const supportHref = supportEmail ? `mailto:${supportEmail}` : undefined;
  const showSupport = onContactSupport || supportEmail;

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] px-6 py-12 ${className}`}>

      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-5">
        <XCircleIcon className="w-8 h-8 text-red-500" />
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-sm leading-relaxed mb-7">{message}</p>

      {(onRetry || showSupport) && (
        <div className="flex items-center gap-3">
          
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant='secondary'
              className="gap-2"
              leftIcon={<ArrowPathIcon className="w-4 h-4" />}
            >
              {retryLabel}
            </Button>
          )}

          {showSupport && (
            supportHref ? (

              <a href={supportHref}>
                <Button 
                  variant="outline" 
                  className="gap-2 text-gray-500" 
                  leftIcon={<ChatBubbleLeftEllipsisIcon className="w-4 h-4" />}
                >
                  Contact Support
                </Button>
              </a>

            ) : (

              <Button
                onClick={onContactSupport}
                variant="outline"
                className="gap-2 text-gray-500"
                leftIcon={<ChatBubbleLeftEllipsisIcon className="w-4 h-4" />}
              >
                Contact Support
              </Button>

            )
          )}
        </div>
      )}

    </div>
  );
}
