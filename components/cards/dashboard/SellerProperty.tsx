"use client"

import { EllipsisVerticalIcon, EyeIcon, TagIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface PropertyStat {
  icon: React.ReactNode;
  label: string;
}

interface PropertyListingCardProps {
  image: string;
  title: string;
  price: string;
  stats: PropertyStat[];
  badges?: { label: string; variant?: 'success' | 'neutral' }[];
  onMenuClick?: () => void;
}

export function PropertyListingCard({
  image,
  title,
  price,
  stats,
  badges = [],
  onMenuClick,
}: PropertyListingCardProps) {
  return (
    <div className="flex flex-col md:flex-row overflow-hidden rounded-xl border border-border bg-card">
      
      <div className="md:w-[40%] h-56 md:h-auto">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">

        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-heading">
            {title}
          </h3>

          <button
            onClick={onMenuClick}
            className="text-muted hover:text-heading"
          >
            <EllipsisVerticalIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-secondary">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-4xl font-bold text-heading">
          {price}
        </div>

        {badges.length > 0 && (
          <div className="mt-6 flex gap-3">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={`
                  rounded-lg px-4 py-2 text-sm font-medium
                  ${
                    badge.variant === 'success'
                      ? 'bg-green-200 text-green-950'
                      : 'bg-muted text-heading'
                  }
                `}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



export const PROPERTY_STATS = [
  {
    icon: <TagIcon className="h-5 w-5" />,
    label: '3 Offers',
  },
  {
    icon: <EyeIcon className="h-5 w-5" />,
    label: '45 Views',
  },
  {
    icon: <ShieldCheckIcon className="h-5 w-5" />,
    label: '₦25,000,000',
  },
];
