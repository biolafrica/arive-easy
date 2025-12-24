'use client';

import { usePathname } from 'next/navigation';
import { DashboardHeader } from './DashboardHeader';
import { getPageTitle } from '../../../utils/layout/getPageTitle';
import { DashboardRole } from '@/type/layout/dashboard';

interface Props {
  role: DashboardRole;
  children: React.ReactNode;
}

export function DashboardLayout({ role, children }: Props) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname, role);

  return (
    <div className="min-h-screen bg-muted">
      <DashboardHeader role={role} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {pageTitle && (
          <h1 className="mb-6 text-3xl font-semibold text-heading">
            {pageTitle}
          </h1>
        )}

        {children}
      </main>
    </div>
  );
}

