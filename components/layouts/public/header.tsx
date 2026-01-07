'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { HomeModernIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Button } from '@/components/primitives/Button';
import { DEFAULT_NAV } from '@/data/layout/public';
import { HeaderProps } from '@/type/layout/public';
import { useCurrentUsers } from '@/hooks/useSpecialized';
import { getDashboardForRole } from '@/utils/common/dashBoardForRole';

export const Header: React.FC<HeaderProps> = ({
  navItems = DEFAULT_NAV,
  className,
}) => {
  const { data: profile } = useCurrentUsers();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const ctaLabel = profile ? 'Dashboard' : 'Get Started';
  const ctaHref = profile ? getDashboardForRole(profile.role) : '/signup';

  const handleCTAClick = () => {
    setMobileOpen(false);
    router.push(ctaHref);
  };

  const isActivePath = (href: string) => {
    return pathname === href;
  };

  return (
    <header className={cn('w-full border-b border-border bg-background', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HomeModernIcon className="h-6 w-6 text-accent" />
            <span className="sr-only">Ariveasy</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-text hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="filled" size="sm" onClick={handleCTAClick}>
              {ctaLabel}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden px-2"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-separator py-4">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-btn-primary text-white font-semibold"
                        : "text-text hover:bg-hover"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};