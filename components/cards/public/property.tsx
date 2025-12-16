import { PropertyImageCarousel } from '@/components/common/PropertyImageCarousel';
import { Property } from '@/type/property';
import { HeartIcon } from '@heroicons/react/24/outline';

interface Props {
  property: Property;
}

export function PropertyCard({ property }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition">
      <div className="relative">
        <PropertyImageCarousel images={property.images} />

        {property.tag && (
          <span
            className={`
              absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-medium text-white
              ${property.tag === 'New Listing' && 'bg-blue-600'}
              ${property.tag === 'Hot Deal' && 'bg-red-500'}
              ${property.tag === 'Luxury' && 'bg-yellow-500 text-black'}
            `}
          >
            {property.tag}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-heading">
            {property.title}
          </h3>
          <HeartIcon className="h-5 w-5 text-secondary hover:text-accent cursor-pointer" />
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-accent">
            <span>Property Price</span>
            <span>₦{property.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-accent">
            <span>Deposit</span>
            <span>₦{property.deposit.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border px-2 py-1">
            {property.size} sqm
          </span>
          <span className="rounded-md border px-2 py-1">
            {property.bedrooms} bedrooms
          </span>
          <span className="rounded-md border px-2 py-1">
            {property.baths} baths
          </span>
        </div>

        <div className="mt-4 space-y-1 text-sm text-secondary">
          <div className="flex justify-between">
            <span>Down Payment</span>
            <span className="text-heading">
              ₦{property.downPayment.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Payment Period</span>
            <span className="text-heading">{property.paymentPeriod}</span>
          </div>
          <div className="flex justify-between">
            <span>Interest Rate</span>
            <span className="text-heading">{property.interestRate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
