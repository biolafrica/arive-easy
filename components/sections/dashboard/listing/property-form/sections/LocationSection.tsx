'use client';

import { useEffect } from 'react';
import { usePropertyFormContext } from '../PropertyFormContext';
import { CITIES_BY_STATE, STATES } from '../pattern/constants';


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

  const showStateError = touched.state && errors.state;
  const showCityError = touched.city && errors.city;
  const showStreetError = touched.street && errors.street;

  const availableCities = CITIES_BY_STATE[values.state] || CITIES_BY_STATE[''];

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-heading">Location</h3>
        <p className="text-sm text-secondary mt-1">
          Specify where this property is located
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-heading mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state"
            name="state"
            value={values.state}
            onChange={(e) => {
              setFieldValue('state', e.target.value);
              setFieldValue('city', '');
            }}
            onBlur={() => setFieldTouched('state')}
            className={`
              mt-1 block w-full rounded-lg border px-3 py-2 
              bg-card text-text
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              ${showStateError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border hover:border-secondary'
              }
            `}
          >
            {STATES.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          {showStateError && (
            <p className="mt-1 text-sm text-red-500">{errors.state}</p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-heading mb-1">
            City / Area <span className="text-red-500">*</span>
          </label>
          <select
            id="city"
            name="city"
            value={values.city}
            onChange={(e) => setFieldValue('city', e.target.value)}
            onBlur={() => setFieldTouched('city')}
            disabled={!values.state}
            className={`
              mt-1 block w-full rounded-lg border px-3 py-2 
              bg-card text-text
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              disabled:bg-hover disabled:text-disabled disabled:cursor-not-allowed
              ${showCityError
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border hover:border-secondary'
              }
            `}
          >
            {availableCities.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          {showCityError && (
            <p className="mt-1 text-sm text-red-500">{errors.city}</p>
          )}
          {!values.state && (
            <p className="mt-1 text-xs text-secondary">Select a state first</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="street" className="block text-sm font-medium text-heading mb-1">
          Street Address
          <span className="text-secondary font-normal ml-1">(Optional)</span>
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={values.street}
          onChange={(e) => setFieldValue('street', e.target.value)}
          onBlur={() => setFieldTouched('street')}
          placeholder="e.g., 15 Admiralty Way"
          className={`
            mt-1 block w-full rounded-lg border px-3 py-2 
            bg-card text-text placeholder-secondary
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            ${showStreetError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border hover:border-secondary'
            }
          `}
        />
        {showStreetError && (
          <p className="mt-1 text-sm text-red-500">{errors.street}</p>
        )}
        <p className="mt-1 text-xs text-secondary">
          Specific street address for the property
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-1">
          Country
        </label>
        <input
          type="text"
          value={values.country}
          disabled
          className="mt-1 block w-full rounded-lg border px-3 py-2 bg-hover text-secondary border-border cursor-not-allowed"
        />
      </div>

      {values.address_full && (values.city || values.state) && (
        <div className="bg-hover rounded-lg p-4 border border-border">
          <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-2">
            Full Address Preview
          </p>
          <p className="text-text">{values.address_full}</p>
        </div>
      )}
    </div>
  );
}

export default LocationSection;