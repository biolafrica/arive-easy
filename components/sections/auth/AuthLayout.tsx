import { HomeModernIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">

      <div className="w-full md:max-w-md md:rounded-2xl md:bg-white p-8 md:shadow-lg">

        <div className='flex items-center justify-center'>
          <Link href='/'> <HomeModernIcon className='w-7 h-7 text-btn-primary mb-4'/> </Link>
        </div>
        
        <h1 className="text-2xl font-semibold text-heading text-center">
          {title}
        </h1>

        {description && (
          <p className="mt-2 text-center text-secondary">
            {description}
          </p>
        )}

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
