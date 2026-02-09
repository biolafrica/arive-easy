'use client';

import { usePropertyFormContext } from '../PropertyFormContext';
import * as constant from '../pattern/constants';
import * as form from "../pattern/components";


export function DetailsSection() {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = usePropertyFormContext();

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
      <form.SectionHeader
        title="Property Details"
        description="Specify the key characteristics of this property"
      />

      <div>
        <form.FormLabel htmlFor="price" required>Price (USD)</form.FormLabel>
        <form.FormInput
          type="text"
          id="price"
          name="price"
          value={values.price ? formatPriceDisplay(values.price) : ''}
          onChange={handlePriceChange}
          onBlur={() => setFieldTouched('price')}
          placeholder="150,000"
          prefixIcon="$"
          error={errors.price}
          showError={touched.price && !!errors.price}
          helperText="All prices are in US Dollars"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <form.FormLabel htmlFor="property_type" required>Property Type</form.FormLabel>
          <form.FormSelect
            id="property_type"
            name="property_type"
            value={values.property_type}
            onChange={(e) => setFieldValue('property_type', e.target.value)}
            onBlur={() => setFieldTouched('property_type')}
            options={constant.PROPERTY_TYPES}
            error={errors.property_type}
            showError={touched.property_type && !!errors.property_type}
          />
        </div>

        <div>
          <form.FormLabel htmlFor="interior" optional>Interior</form.FormLabel>
          <form.FormSelect
            id="interior"
            name="interior"
            value={values.interior}
            onChange={(e) => setFieldValue('interior', e.target.value)}
            onBlur={() => setFieldTouched('interior')}
            options={constant.INTERIOR_OPTIONS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <form.FormLabel htmlFor="bedrooms" required>Bedrooms</form.FormLabel>
          <form.FormInput
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={values.bedrooms}
            onChange={(e) => setFieldValue('bedrooms', parseInt(e.target.value) || 0)}
            onBlur={() => setFieldTouched('bedrooms')}
            min={constant.VALIDATION_RULES.bedrooms.min}
            max={constant.VALIDATION_RULES.bedrooms.max}
            error={errors.bedrooms}
            showError={touched.bedrooms && !!errors.bedrooms}
          />
        </div>

        <div>
          <form.FormLabel htmlFor="bathrooms" required>Bathrooms</form.FormLabel>
          <form.FormInput
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={values.bathrooms}
            onChange={(e) => setFieldValue('bathrooms', parseInt(e.target.value) || 0)}
            onBlur={() => setFieldTouched('bathrooms')}
            min={constant.VALIDATION_RULES.bathrooms.min}
            max={constant.VALIDATION_RULES.bathrooms.max}
            error={errors.bathrooms}
            showError={touched.bathrooms && !!errors.bathrooms}
          />
        </div>

        <div>
          <form.FormLabel htmlFor="area_sqm" optional>Area (sqm)</form.FormLabel>
          <form.FormInput
            type="number"
            id="area_sqm"
            name="area_sqm"
            value={values.area_sqm}
            onChange={(e) => setFieldValue('area_sqm', e.target.value)}
            onBlur={() => setFieldTouched('area_sqm')}
            min={constant.VALIDATION_RULES.area_sqm.min}
            max={constant.VALIDATION_RULES.area_sqm.max}
            placeholder="e.g., 150"
            error={errors.area_sqm}
            showError={touched.area_sqm && !!errors.area_sqm}
          />
        </div>
      </div>

      <div>
        <form.FormLabel htmlFor="listing_tag" optional>Listing Tag</form.FormLabel>
        <form.FormSelect
          id="listing_tag"
          name="listing_tag"
          value={values.listing_tag}
          onChange={(e) => setFieldValue('listing_tag', e.target.value)}
          onBlur={() => setFieldTouched('listing_tag')}
          options={constant.LISTING_TAGS}
          helperText="Add a special tag to highlight this property"
        />
      </div>
    </div>
  );
}

export default DetailsSection;