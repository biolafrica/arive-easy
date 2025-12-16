import React from 'react';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { StaticImageData } from 'next/image';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type FallbackType = 'initials' | 'icon';

interface UserAvatarProps {
  src?: string | StaticImageData ;
  name?: string;
  size?: AvatarSize;
  fallback?: FallbackType;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  fallback = 'initials',
  className,
}) => {
  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ?? '';

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full bg-hover text-secondary overflow-hidden',
        sizeClasses[size],
        className
      )}
      aria-label={name ? `${name} avatar` : 'User avatar'}
    >
      {src ? (
        <Image
          src={src}
          alt={name ?? 'User avatar'}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : fallback === 'initials' && initials ? (
        <span className="font-medium text-text">
          {initials}
        </span>
      ) : (
        <UserIcon className="h-2/3 w-2/3 text-secondary" />
      )}
    </div>
  );
};
