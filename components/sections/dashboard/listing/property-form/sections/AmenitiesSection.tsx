'use client';

import { usePropertyFormContext } from '../PropertyFormContext';
import { AMENITIES } from '../pattern/constants';

export function AmenitiesSection() {
  const {values, toggleAmenity} = usePropertyFormContext();

  const selectedAmenities = values.amenities || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-heading">Amenities & Features</h3>
        <p className="text-sm text-secondary mt-1">
          Select all amenities that this property offers
        </p>
      </div>

   
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {AMENITIES.map((amenity) => {
          const isSelected = selectedAmenities.includes(amenity.id);
          
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => toggleAmenity(amenity.id)}
              className={`
                relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200
                ${isSelected
                  ? 'bg-orange-100 border-orange-900 text-secondary'
                  : 'bg-card border-border text-text hover:border-secondary hover:bg-hover'
                }
              `}
            >
              <span className="text-xl flex-shrink-0">{amenity.icon}</span>

              <span className="text-sm font-medium flex-1 leading-tight">
                {amenity.label}
              </span>

            </button>
          );
        })}
      </div>

      <div className="text-sm text-secondary">
        {selectedAmenities.length === 0 ? (
          'No amenities selected'
        ) : (
          `${selectedAmenities.length} ${selectedAmenities.length === 1 ? 'amenity' : 'amenities'} selected`
        )}
      </div>
    </div>
  );
}

export default AmenitiesSection;