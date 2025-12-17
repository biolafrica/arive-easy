import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-heading text-center">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-center text-secondary">
            {description}
          </p>
        )}

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
