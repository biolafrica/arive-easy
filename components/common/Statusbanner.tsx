import * as icon from "@heroicons/react/24/solid";
import { ComponentType } from "react";

type StatusVariant = | "success" | "error" | "warning" | "info" | "pending" | "loading" | "review";

interface StatusBannerProps {
  variant: StatusVariant;
  title: string;
  message: string;
  icon?: ComponentType<{ className?: string }>;
  children?: React.ReactNode;
  className?: string;
}

const VARIANT_CONFIG: Record<
  StatusVariant,
  { container: string;
    iconColor: string;
    titleColor: string;
    textColor: string;
    defaultIcon: ComponentType<{ className?: string }>;
    spin?: boolean;
  }
> = {
  success: {
    container: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    titleColor: "text-green-900",
    textColor: "text-green-700",
    defaultIcon: icon.CheckCircleIcon,
  },
  error: {
    container: "bg-red-50 border-red-200",
    iconColor: "text-red-600",
    titleColor: "text-red-900",
    textColor: "text-red-700",
    defaultIcon: icon.XCircleIcon,
  },
  warning: {
    container: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    titleColor: "text-amber-900",
    textColor: "text-amber-700",
    defaultIcon: icon.ExclamationTriangleIcon,
  },
  info: {
    container: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
    textColor: "text-blue-700",
    defaultIcon: icon.InformationCircleIcon,
  },
  pending: {
    container: "bg-yellow-50 border-yellow-200",
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-900",
    textColor: "text-yellow-700",
    defaultIcon: icon.ClockIcon,
  },
  loading: {
    container: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    titleColor: "text-blue-900",
    textColor: "text-blue-700",
    defaultIcon: icon.ArrowPathIcon,
    spin: true,
  },
  review: {
    container: "bg-yellow-50 border-yellow-200",
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-900",
    textColor: "text-yellow-700",
    defaultIcon: icon.ArrowPathIcon,
    spin: true,
  },
};


export function StatusBanner({
  variant,
  title,
  message,
  icon,
  children,
  className = "",
}: StatusBannerProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = icon ?? config.defaultIcon;

  return (
    <div
      className={`rounded-lg border p-4 mb-6 ${config.container} ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`h-6 w-6 shrink-0 mt-0.5 ${config.iconColor} ${
            config.spin ? "animate-spin" : ""
          }`}
        />
        <div className="flex-1">
          <h3 className={`font-semibold ${config.titleColor}`}>{title}</h3>
          <p className={`mt-1 text-sm ${config.textColor}`}>{message}</p>
          {children}
        </div>
      </div>
    </div>
  );
}