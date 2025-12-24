'use client';

import React from 'react';
import Link from 'next/link';
import {HomeModernIcon} from '@heroicons/react/24/outline';
import { FooterProps } from '@/type/layout/public';
import { DEFAULT_COLUMNS } from '@/data/layout/public';
import { newsletterFields } from '@/data/newsletter';
import { validateNewsletter } from '@/utils/validate';
import Form from '@/components/form/Form';
import { NewsletterValues } from '@/type/newsletter';
import { Facebook, Linkedin, Twitter } from '@/data/icons';
import { useSubscriber } from '@/hooks/useSpecialized';


export const Footer: React.FC<FooterProps> = ({
  columns = DEFAULT_COLUMNS,
}) => {
  const create = useSubscriber();

  const handleNewsletterSubmit = async (values: NewsletterValues) => {
    create(values)
    console.log('Newsletter signup:', values.email);
  };

  return (
    <footer className="bg-[#0B1F4B] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">

          <div className='flex-col content-center'>
            <h3 className="text-lg font-semibold">
              Join our newsletter
            </h3>
            <p className="mt-2 text-sm text-white/80 max-w-md">
              Lorem ipsum dolor sit amet, consectetur.
            </p>
          </div>

          <div>
            <Form<NewsletterValues>
              fields={newsletterFields}
              validate={validateNewsletter}
              initialValues={{email:""}}
              onSubmit={handleNewsletterSubmit}
              submitLabel="Subscribe"
              fullWidthSubmit={false}
              className="flex flex-col md:flex-row sm:gap-3 sm:justify-end" 
              submitButtonVariant="outline"
            />

            <p className="mt-3 text-xs text-white/70 md:text-right ">
              By subscribing you agree to our{' '}
              <Link
                href="/privacy"
                className="underline hover:text-white"
              >
                Privacy Policy
              </Link>
            </p>

          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 grid gap-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <HomeModernIcon className="h-8 w-8 text-accent" />
            <span className="sr-only">Ariveasy</span>
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
            © {new Date().getFullYear()} Arive Technologies
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
