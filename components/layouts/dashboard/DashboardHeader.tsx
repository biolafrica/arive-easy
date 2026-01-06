'use client';

import { useState } from 'react';
import { HomeIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { UserMenu } from './UserMenu';
import { DashboardRole } from '@/type/layout/dashboard';
import { dashboardForRole } from '@/utils/common/dashBoardForRole';
import Link from 'next/link';
import ConfirmBanner from '@/components/feedbacks/ConfirmBanner';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function DashboardHeader({ role }: { role: DashboardRole }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  const requestLogout = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
      } else {
        router.push('/login');
      }
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    } finally {
      setShowLogoutDialog(false);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/${dashboardForRole(role)}`}
            className="flex items-center gap-2 text-orange-600"
          >
            <HomeIcon className="h-7 w-7" />
            <span className="font-semibold text-lg">Ariveasy</span>
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

