'use client';

import { useState } from 'react';
import { HomeIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';
import { DashboardRole } from '@/type/layout/dashboard';
import { dashboardForRole } from '@/utils/common/dashBoardForRole';
import Link from 'next/link';


export function DashboardHeader({ role }: { role: DashboardRole }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${dashboardForRole(role)}`} className="flex items-center gap-2 text-orange-600">
            <HomeIcon className="h-7 w-7" />
            <span className="font-semibold text-lg">Ariveasy</span>
          </Link>

          {/* Desktop nav */}
          <DesktopNav role={role} />

          {/* Right */}
          <div className="flex items-center gap-3">
            <UserMenu />

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-md p-2 hover:bg-muted"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        role={role}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
