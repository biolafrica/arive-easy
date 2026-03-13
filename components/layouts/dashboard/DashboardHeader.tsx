'use client';

import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';
import { DashboardRole } from '@/type/layout/dashboard';
import { dashboardForRole } from '@/utils/common/dashBoardForRole';
import Link from 'next/link';
import ConfirmBanner from '@/components/feedbacks/ConfirmBanner';
import lglogo from '@/public/icons/kletch-web-lg.svg'
import smlogo from '@/public/icons/kletch-color.svg'
import Image from 'next/image';
import { useLogout } from '@/hooks/useSpecialized/useUser';


export function DashboardHeader({ role }: { role: DashboardRole }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const { logout } = useLogout();

  const requestLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    await logout();
    setShowLogoutDialog(false);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/${dashboardForRole(role)}`}
            className="flex items-center gap-2 text-orange-600"
          >
            <Image
              src={lglogo}
              alt="Kletch"
              className="hidden lg:block"
            />
            <Image
              src={smlogo}
              alt="Kletch"
              className="block lg:hidden h-6 w-auto"
            />
          </Link>

          <DesktopNav role={role} />

          <div className="flex items-center gap-3">
            <UserMenu role={role} onLogout={requestLogout} />

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
        onLogout={requestLogout}
      />

      <ConfirmBanner
        open={showLogoutDialog}
        title="Logout"
        message="Are you sure you want to logout? This action cannot be undone."
        variant="danger"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </>
  );
}

