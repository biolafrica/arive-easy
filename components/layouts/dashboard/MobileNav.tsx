'use client';

import { NAV_ITEMS } from '@/data/layout/dashboard';
import { DashboardRole } from '@/type/layout/dashboard';
import { XMarkIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export function MobileNav({
  role,
  open,
  onClose,
  onLogout,
}: {
  role: DashboardRole;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <HomeIcon className="h-7 w-7 text-orange-600" />
        <button onClick={onClose} className="rounded-md p-1 hover:bg-muted transition">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="p-4 space-y-1">
        {NAV_ITEMS[role].map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all
                active:scale-[0.97] active:bg-orange-50
                ${active
                  ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                  : 'text-heading hover:bg-muted hover:text-orange-600 border-l-4 border-transparent'
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}

        <hr className="my-4" />

        <div className="space-y-1 text-sm">
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/${role}-dashboard/settings`}
            onClick={onClose}
            className="flex items-center rounded-lg px-4 py-3 font-medium text-heading hover:bg-muted transition active:scale-[0.97]"
          >
            Profile Settings
          </Link>
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/${role}-dashboard/support`}
            onClick={onClose}
            className="flex items-center rounded-lg px-4 py-3 font-medium text-heading hover:bg-muted transition active:scale-[0.97]"
          >
            Support
          </Link>
          <button
            onClick={onLogout}
            className="flex w-full items-center rounded-lg px-4 py-3 font-medium text-red-600 hover:bg-red-50 transition active:scale-[0.97]"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
