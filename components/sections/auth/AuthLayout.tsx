import Link from 'next/link';
import { ReactNode } from 'react';
import smlogo from '@/public/icons/kletch-color.svg'
import Image from 'next/image';

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
          <Link href='/'> 
            <Image
              src={smlogo}
              alt="Kletch"
              className="h-6 w-auto mb-4"
            />
          </Link>
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
