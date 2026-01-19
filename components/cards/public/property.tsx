import { PropertyImageCarousel } from '@/components/common/PropertyImageCarousel';
import { useFavorites } from '@/hooks/useSpecialized';
import { formatNaira, formatNumber } from '@/lib/formatter';
import { useAuthContext } from '@/providers/auth-provider';
import { PropertyData } from '@/type/pages/property';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { toast } from 'sonner';

interface Props {
  property: PropertyData;
  interfaceType?: string;
}

export function PropertyCard({ property, interfaceType = 'client' }: Props) {
  const { user } = useAuthContext();
  
  const { isFavorited, toggleFavorite, isToggling } = useFavorites()

  const favorited = user ? isFavorited(property.id) : false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to save properties');
      return;
    }
    
    toggleFavorite(property.id);
  };

  return (
    <Link href={`/${interfaceType === 'client' ? "properties" :"user-dashboard/properties"}/${property.id}`}>
      <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition">
        <div className="relative">
          <PropertyImageCarousel images={property.images} />

          {property.listing_tag && (
            <span
              className={`
                absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-medium text-white
                ${property.listing_tag === 'New Listing' && 'bg-blue-600'}
                ${property.listing_tag === 'Hot Deal' && 'bg-red-500'}
                ${property.listing_tag === 'Luxury' && 'bg-yellow-500 text-black'}
              `}
            >
              {property.listing_tag}
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-heading">
              {property.title}
            </h3>

            <button onClick={handleFavoriteClick} disabled={isToggling} className="transition-all hover:scale-110" >
              {favorited ? (
                <HeartSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartOutline className="h-5 w-5 text-secondary hover:text-red-500" />
              )}
            </button>

          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-accent">
              <span>Property Price</span>
              <span>{formatNaira(property.price)}</span>
            </div>
            <div className="flex justify-between text-accent">
              <span>Deposit</span>
              <span>{formatNaira(property.deposit)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md border px-2 py-1">
              {formatNumber(property.area_sqm)} sqm
            </span>
            <span className="rounded-md border px-2 py-1">
              {property.bedrooms} bedrooms
            </span>
            <span className="rounded-md border px-2 py-1">
              {property.bathrooms} baths
            </span>
          </div>

          <div className="mt-4 space-y-1 text-sm text-secondary">
            <div className="flex justify-between">
              <span>Down Payment</span>
              <span className="text-heading">
                {formatNaira(property.down_payment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Period</span>
              <span className="text-heading">{`${property.payment_period} Years`}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest Rate</span>
              <span className="text-heading">{`${property.interest_rate} p.a`}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
