import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

export const StatusHeader = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: {
      icon: ClockIcon,
      text: "Awaiting Approval",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-800"
    },
    approved: {
      icon: CheckCircleIcon,
      text: "Successfully Approved",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-800"
    },
    rejected: {
      icon: XCircleIcon,
      text: "Application Rejected",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-800"
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-6 w-6 ${config.iconColor}`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${config.textColor}`}>
            {config.text}
          </h3>

          {status === 'pending' && (
            <p className="text-sm text-gray-600 mt-1">
              Review the application details below and take appropriate action.
            </p>
          )}

          {status === 'approved' && (
            <p className="text-sm text-gray-600 mt-1">
              This application has been approved and the applicant has been notified.
            </p>
          )}

          {status === 'rejected' && (
            <p className="text-sm text-gray-600 mt-1">
              This application has been rejected and the applicant has been notified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};