'use client';

import { NAV_ITEMS } from '@/data/layout/dashboard';
import { DashboardRole } from '@/type/layout/dashboard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export function DesktopNav({ role }: { role: DashboardRole }) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role];

  return (
    <nav className="hidden lg:flex gap-8">
      {items.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              relative pb-1 text-sm font-medium transition
              ${active ? 'text-orange-600' : 'text-secondary'}
              hover:text-heading
            `}
          >
            {item.label}

            {/* underline */}
            <span
              className={`
                absolute left-0 -bottom-1 h-0.5 w-full transition
                ${active
                  ? 'bg-orange-600'
                  : 'bg-transparent group-hover:bg-gray-300'}
              `}
            />
          </Link>
        );
      })}
    </nav>
  );
}
