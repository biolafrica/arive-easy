import { STATUS_CONFIG } from "@/data/pages/dashboard/application";
import { StatusBannerProps } from "@/type/pages/dashboard/application";

export function StatusBanner({
  variant,
  propertyName,
  reason,
}: StatusBannerProps) {
  const config = STATUS_CONFIG[variant];
  const Icon = config.icon;

  return (
    <div
      className={`mb-6 rounded-lg border p-4 ${config.container}`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-6 w-6 shrink-0 mt-0.5 ${config.iconColor}`}/>

        <div>
          <h3 className={`font-semibold ${config.titleColor}`}> {config.title} </h3>

          <p className={`mt-1 text-sm ${config.textColor}`}> {config.defaultMessage(propertyName)} </p>

          {variant === 'declined' && reason && (
            <div className="mt-2 rounded bg-red-100 p-2 text-sm text-red-800"> <strong>Reason:</strong> {reason} </div>
          )}

          {variant === 'declined' && (
            <p className="mt-2 text-sm text-red-700"> Please select another property below. </p>
          )}
        </div>
      </div>
    </div>
  );
}
