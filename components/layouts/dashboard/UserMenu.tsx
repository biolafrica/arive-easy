'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';



export function UserMenu({
  role,
  onLogout,
  userImage,
  userName,
}: {
  role: any;
  onLogout: () => void;
  userImage?: string | null;
  userName?: string | null;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
    setNotifOpen(false);
  };

  const toggleNotif = () => {
    setNotifOpen((prev) => !prev);
    setProfileOpen(false);
  };

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="relative hidden lg:flex items-center gap-3">

      <div ref={notifRef} className="relative">
        <button
          onClick={toggleNotif}
          className={`rounded-full p-1.5 transition hover:bg-muted ${notifOpen ? 'bg-muted text-orange-600' : 'text-secondary'}`}
        >
          <BellIcon className="w-6 h-6" />
        </button>

        {notifOpen && (
          <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-lg z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold text-heading">Notifications</p>
            </div>
            <div className="px-4 py-6 text-center text-sm text-secondary">
              No notifications yet.
            </div>
          </div>
        )}
      </div>

      <div ref={profileRef} className="relative">
        <button
          onClick={toggleProfile}
          className={`rounded-full ring-2 transition ${profileOpen ? 'ring-orange-500' : 'ring-transparent hover:ring-gray-300'}`}
        >
          {userImage ? (
            <Image
              src={userImage}
              alt={userName ?? 'User avatar'}
              width={34}
              height={34}
              className="rounded-full object-cover"
              unoptimized={userImage.startsWith('http')}
            />
          ) : (
            <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
              {initials}
            </span>
          )}
        </button>

        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-lg z-50 overflow-hidden">
            <Link
              href={`${process.env.NEXT_PUBLIC_API_URL}/${role}-dashboard/settings`}
              className="block px-4 py-2.5 text-sm hover:bg-muted transition"
              onClick={() => setProfileOpen(false)}
            >
              Profile settings
            </Link>
            <Link
              href={`${process.env.NEXT_PUBLIC_API_URL}/${role}-dashboard/support`}
              className="block px-4 py-2.5 text-sm hover:bg-muted transition"
              onClick={() => setProfileOpen(false)}
            >
              Support
            </Link>
            <hr />
            <button
              onClick={() => { setProfileOpen(false); onLogout(); }}
              className="block w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 transition"
            >
              Sign out
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
