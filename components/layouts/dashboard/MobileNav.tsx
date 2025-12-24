'use client';

import { NAV_ITEMS } from '@/data/layout/dashboard';
import { DashboardRole } from '@/type/layout/dashboard';
import { XMarkIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Props {
  role: DashboardRole;
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ role, open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <HomeIcon className="h-7 w-7 text-orange-600" />
        <button onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {NAV_ITEMS[role].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="block text-lg font-medium text-heading"
          >
            {item.label}
          </Link>
        ))}

        <hr />

        <div className="space-y-3 text-sm">
          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${role}-dashboard/settings`} className="block">profile Settings</Link>
          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${role}-dashboard/support`} className="block">Support</Link>
          <button className="block text-red-600" >Sign out</button>
        </div>
      </div>
    </div>
  );
}
