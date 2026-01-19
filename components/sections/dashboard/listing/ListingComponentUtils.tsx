import { PropertyListingCard } from "@/components/cards/dashboard/SellerProperty";
import { Button } from "@/components/primitives/Button";
import { PropertyBase } from "@/type/pages/property";

type PropertyStatus = '' |'draft'|'active'|'inactive'|'withdrawn'|'offers'
| 'reserved'| 'in_progress'| 'sold'| 'paused';

const statuses=[
  {key:1, value:"" , item:"All statuses"},
  {key:2, value:"draft" , item:"Draft"},
  {key:3, value:"active" , item:"Active"},
  {key:4, value:"inactive" , item:"In Active"},
  {key:5, value:"withdrawn" , item:"Withdrawn"},
  {key:6, value:"offers" , item:"Offers"},
  {key:7, value:"reserved" , item:"Reserved"},
  {key:8, value:"in_progress" , item:"In Progress"},
  {key:9, value:"sold" , item:"Sold"},
  {key:10, value:"paused" , item:"Paused"},

]

interface PropertyStatusFilterProps {
  value: PropertyStatus;
  onChange: (status: PropertyStatus) => void;
}

export function PropertyStatusFilter({ value, onChange }: PropertyStatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as PropertyStatus)}
      className="rounded-lg border border-border bg-background pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {statuses.map((status)=>(
        (<option key={status.key} value={`${status.value}`}> {status.item}</option>)
      ))}
    </select>
  );
}


interface ActiveFiltersBadgeProps {
  count: number;
  onClear: () => void;
}

export function ActiveFiltersBadge({ count, onClear }: ActiveFiltersBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>
        {count} filter{count !== 1 ? 's' : ''} applied
      </span>
      <button
        onClick={onClear}
        className="text-primary hover:underline font-medium"
      >
        Clear all
      </button>
    </div>
  );
}


interface PropertiesGridProps {
  properties: PropertyBase[];
  onEdit: (property: PropertyBase) => void; 
}

export function PropertiesGrid({ properties, onEdit }: PropertiesGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
      {properties.map((property) => (
        <PropertyListingCard 
          key={property.id}
          property={property} 
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}


interface LoadMoreButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export function LoadMoreButton({ isLoading, onClick }: LoadMoreButtonProps) {
  return (
    <div className="mt-8 flex justify-center">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={isLoading}
        className="min-w-[200px]"
      >
        {isLoading ? 'Loading...' : 'View More Properties'}
      </Button>
    </div>
  );
}


export function LoadingMoreSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={`loading-${i}`} className="animate-pulse space-y-4">
          <div className="bg-gray-200 h-48 rounded-lg" />
          <div className="space-y-2">
            <div className="bg-gray-200 h-4 w-3/4 rounded" />
            <div className="bg-gray-200 h-4 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}