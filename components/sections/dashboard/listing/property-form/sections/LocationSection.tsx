'use client';

import { useEffect } from 'react';
import { usePropertyFormContext } from '../PropertyFormContext';
import { CITIES_BY_STATE, STATES } from '../pattern/constants';
import * as form from "../pattern/components";

export function LocationSection() {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
  } = usePropertyFormContext();

  useEffect(() => {
    if (values.state) {
      const citiesForState = CITIES_BY_STATE[values.state] || [];
      const cityExists = citiesForState.some(c => c.value === values.city);
      
      if (!cityExists && values.city) {
        setFieldValue('city', '');
      }
    }
  }, [values.state]);

  const availableCities = CITIES_BY_STATE[values.state] || CITIES_BY_STATE[''];

  return (
    <div className="space-y-6">
      <form.SectionHeader
        title="Location"
        description="Specify where this property is located"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <form.FormLabel htmlFor="state" required>State</form.FormLabel>
          <form.FormSelect
            id="state"
            name="state"
            value={values.state}
            onChange={(e) => {
              setFieldValue('state', e.target.value);
              setFieldValue('city', '');
            }}
            onBlur={() => setFieldTouched('state')}
            options={STATES}
            error={errors.state}
            showError={touched.state && !!errors.state}
          />
        </div>

        <div>
          <form.FormLabel htmlFor="city" required>City / Area</form.FormLabel>
          <form.FormSelect
            id="city"
            name="city"
            value={values.city}
            onChange={(e) => setFieldValue('city', e.target.value)}
            onBlur={() => setFieldTouched('city')}
            disabled={!values.state}
            options={availableCities}
            error={errors.city}
            showError={touched.city && !!errors.city}
            helperText={!values.state ? "Select a state first" : undefined}
          />
        </div>
      </div>

      <div>
        <form.FormLabel htmlFor="street" optional>Street Address</form.FormLabel>
        <form.FormInput
          type="text"
          id="street"
          name="street"
          value={values.street}
          onChange={(e) => setFieldValue('street', e.target.value)}
          onBlur={() => setFieldTouched('street')}
          placeholder="e.g., 15 Admiralty Way"
          error={errors.street}
          showError={touched.street && !!errors.street}
          helperText="Specific street address for the property"
        />
      </div>

      <div>
        <form.FormLabel>Country</form.FormLabel>
        <form.FormInput
          type="text"
          value={values.country}
          disabled
        />
      </div>

      {values.address_full && (values.city || values.state) && (
        <form.InfoBox title="Full Address Preview">
          <p className="text-text">{values.address_full}</p>
        </form.InfoBox>
      )}
    </div>
  );
}

export default LocationSection;