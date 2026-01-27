'use client';
import { usePropertyFormContext } from '../PropertyFormContext';
import { INTERIOR_OPTIONS, LISTING_TAGS, PROPERTY_TYPES, VALIDATION_RULES } from '../pattern/constants';


export function DetailsSection() {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = usePropertyFormContext();

  const showPriceError = touched.price && errors.price;
  const showPropertyTypeError = touched.property_type && errors.property_type;
  const showBedroomsError = touched.bedrooms && errors.bedrooms;
  const showBathroomsError = touched.bathrooms && errors.bathrooms;
  const showAreaError = touched.area_sqm && errors.area_sqm;

  const formatPriceDisplay = (value: string): string => {
    const num = parseFloat(value.replace(/,/g, ''));
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    setFieldValue('price', rawValue);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-heading">Property Details</h3>
        <p className="text-sm text-secondary mt-1">
          Specify the key characteristics of this property
        </p>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-heading mb-1">
          Price (USD) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
            $
          </span>
          <input
            type="text"
            id="price"
            name="price"
            value={values.price ? formatPriceDisplay(values.price) : ''}
            onChange={handlePriceChange}
            onBlur={() => setFieldTouched('price')}
            placeholder="150,000"
            className={`
              mt-1 block w-full rounded-lg border pl-7 pr-3 py-2 bg-card text-text placeholder-secondary
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              ${showPriceError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border hover:border-secondary'
              }
            `}
          />
        </div>
        {showPriceError && (
          <p className="mt-1 text-sm text-red-500">{errors.price}</p>
        )}
        <p className="mt-1 text-xs text-secondary">
          All prices are in US Dollars
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="property_type" className="block text-sm font-medium text-heading mb-1">
            
            Property Type <span className="text-red-500">*</span>
          </label>
          <select
            id="property_type"
            name="property_type"
            value={values.property_type}
            onChange={(e) => setFieldValue('property_type', e.target.value)}
            onBlur={() => setFieldTouched('property_type')}
            className={`
              mt-1 block w-full rounded-lg border px-3 py-2 bg-card text-text
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              ${showPropertyTypeError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border hover:border-secondary'
              }
            `}
          >
            {PROPERTY_TYPES.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          {showPropertyTypeError && (
            <p className="mt-1 text-sm text-red-500">{errors.property_type}</p>
          )}
        </div>

        <div>
          <label htmlFor="interior" className="block text-sm font-medium text-heading mb-1">
            Interior
            <span className="text-secondary font-normal ml-1">(Optional)</span>
          </label>
          <select
            id="interior"
            name="interior"
            value={values.interior}
            onChange={(e) => setFieldValue('interior', e.target.value)}
            onBlur={() => setFieldTouched('interior')}
            className="mt-1 block w-full rounded-lg border px-3 py-2 bg-card text-text transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent border-border hover:border-secondary"
          >
            {INTERIOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-heading mb-1">
            Bedrooms <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={values.bedrooms}
            onChange={(e) => setFieldValue('bedrooms', parseInt(e.target.value) || 0)}
            onBlur={() => setFieldTouched('bedrooms')}
            min={VALIDATION_RULES.bedrooms.min}
            max={VALIDATION_RULES.bedrooms.max}
            className={`
              mt-1 block w-full rounded-lg border px-3 py-2 bg-card text-text transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              ${showBedroomsError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border hover:border-secondary'
              }
            `}
          />
          {showBedroomsError && (
            <p className="mt-1 text-sm text-red-500">{errors.bedrooms}</p>
          )}
        </div>

        <div>
          <label htmlFor="bathrooms" className="block text-sm font-medium text-heading mb-1">
            Bathrooms <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={values.bathrooms}
            onChange={(e) => setFieldValue('bathrooms', parseInt(e.target.value) || 0)}
            onBlur={() => setFieldTouched('bathrooms')}
            min={VALIDATION_RULES.bathrooms.min}
            max={VALIDATION_RULES.bathrooms.max}
            className={`
              mt-1 block w-full rounded-lg border px-3 py-2 bg-card text-text transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              ${showBathroomsError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border hover:border-secondary'
              }
            `}
          />
          {showBathroomsError && (
            <p className="mt-1 text-sm text-red-500">{errors.bathrooms}</p>
          )}
        </div>

        <div>
          <label htmlFor="area_sqm" className="block text-sm font-medium text-heading mb-1">
            Area (sqm)
            <span className="text-secondary font-normal ml-1">(Optional)</span>
          </label>
          <input
            type="number"
            id="area_sqm"
            name="area_sqm"
            value={values.area_sqm}
            onChange={(e) => setFieldValue('area_sqm', e.target.value)}
            onBlur={() => setFieldTouched('area_sqm')}
            min={VALIDATION_RULES.area_sqm.min}
            max={VALIDATION_RULES.area_sqm.max}
            placeholder="e.g., 150"
            className={`
              mt-1 block w-full rounded-lg border px-3 py-2 bg-card text-text placeholder-secondary
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              ${showAreaError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border hover:border-secondary'
              }
            `}
          />
          {showAreaError && (
            <p className="mt-1 text-sm text-red-500">{errors.area_sqm}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="listing_tag" className="block text-sm font-medium text-heading mb-1">
          Listing Tag
          <span className="text-secondary font-normal ml-1">(Optional)</span>
        </label>
        <select
          id="listing_tag"
          name="listing_tag"
          value={values.listing_tag}
          onChange={(e) => setFieldValue('listing_tag', e.target.value)}
          onBlur={() => setFieldTouched('listing_tag')}
          className="mt-1 block w-full rounded-lg border px-3 py-2 bg-card text-text transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent border-border hover:border-secondary"
        >
          {LISTING_TAGS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-secondary">
          Add a special tag to highlight this property
        </p>
      </div>
    </div>
  );
}

export default DetailsSection;