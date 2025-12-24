import { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string
}

export function SettingsSection({
  title,
  description,
  children,
  className
}: SettingsSectionProps) {
  return (
    <div className={`${className} grid gap-5 py-9 lg:grid-cols-3`}>
      
      <div className="lg:col-span-1">
        <h4 className="text-base font-medium text-text">
          {title}
        </h4>
        {description && (
          <p className="mt-1 text-sm text-secondary">
            {description}
          </p>
        )}
      </div>

      <div className="lg:col-span-2">
        {children}
      </div>

    </div>
  );
}
