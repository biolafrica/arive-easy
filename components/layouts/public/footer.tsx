'use client';

import React from 'react';
import Link from 'next/link';
import { FooterProps } from '@/type/layout/public';
import { DEFAULT_COLUMNS } from '@/data/layout/public';
import { Facebook, Linkedin, Twitter } from '@/data/icons';
import lglogo from '@/public/icons/kletch-full-white.svg'
import Image from 'next/image';
import { NewsletterForm } from './NewsletterForm';


export const Footer: React.FC<FooterProps> = ({
  columns = DEFAULT_COLUMNS,
}) => {


  return (
    <footer className="bg-[#0B1F4B] text-white">

      <div className="relative border-t border-white/8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
  
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16 md:items-center">
  
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-blue-400/60" />
                <span className="text-xs font-medium tracking-widest text-blue-300/80 uppercase">
                  Newsletter
                </span>
              </div>
  
              <h3 className="text-2xl font-semibold tracking-tight text-white leading-snug">
                Stay ahead of the <br className="hidden sm:block" />
                property market.
              </h3>
  
              <p className="text-sm text-white/55 leading-relaxed max-w-sm">
                Verified listings, mortgage insights, and smarter ways to invest in 
                property back home, delivered straight to your inbox.
              </p>
            </div>
  
            <div>
              <NewsletterForm />
            </div>
  
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 grid gap-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={lglogo}
              alt="Kletch"
            />
          </Link>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold mb-4">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Kletch Technologies Inc.
          </p>

          <div className="flex items-center gap-4">
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-white/70 hover:text-white" />
            </Link>
            <Link href="#" aria-label="X">
              <Twitter className="h-5 w-5 text-white/70 hover:text-white" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-white/70 hover:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
