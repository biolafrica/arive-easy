'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function UserMenu({role}:any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative hidden lg:block ">
      <button className='mr-3'>
        <BellIcon className='w-7 h-7 text-secondary'/>
      </button>

      <button onClick={() => setOpen(!open)}>
        <Image
          src="/dp-2.jpg"
          alt="User"
          width={32}
          height={32}
          className="rounded-full"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-md">
          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${role}-dashboard/settings`} className="block px-4 py-2 text-sm hover:bg-muted">
            Profile settings
          </Link>

          <Link href={`${process.env.NEXT_PUBLIC_API_URL}/${role}-dashboard/support`} className="block px-4 py-2 text-sm hover:bg-muted">
            Support
          </Link>

          <button className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-muted">
            Sign out
          </button>
        </div>
      )}

    </div>
  );
}
