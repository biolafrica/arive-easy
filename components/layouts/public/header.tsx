'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HomeModernIcon,Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { Button } from '@/components/primitives/Button';
import { DASHBOARD_BY_ROLE, DEFAULT_NAV } from '@/data/layout/public';
import { HeaderProps } from '@/type/layout/public';

export const Header: React.FC<HeaderProps> = ({
  navItems = DEFAULT_NAV,
  isAuthenticated = false,
  userRole = 'buyer',
  className,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const ctaLabel = isAuthenticated ? 'Dashboard' : 'Get Started';
  const ctaHref = isAuthenticated ? DASHBOARD_BY_ROLE[userRole] : '/signup';

  const handleCTAClick = () => {
    setMobileOpen(false);
    router.push(ctaHref);
  };

  return (
    <header className={cn('w-full border-b border-border bg-background', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HomeModernIcon className="h-6 w-6 text-accent" />
            <span className="sr-only">Ariveasy</span>
          </Link>

          {/* Desktop Nav */}
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

            {/* Mobile menu toggle */}
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

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-separator py-4">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-text hover:bg-hover"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
