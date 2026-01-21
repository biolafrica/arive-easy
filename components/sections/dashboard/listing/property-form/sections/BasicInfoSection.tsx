'use client'

import { usePropertyFormContext } from "../PropertyFormContext";
import { getCharacterCountText } from "../functions/validation";
import { PROPERTY_STATUS_OPTIONS, VALIDATION_RULES } from "../pattern/constants";

export function BasicInfoSection() {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    characterCounts,
    mode,
  } = usePropertyFormContext();

  const titleCharCount = getCharacterCountText(
    values.title,
    VALIDATION_RULES.title.minLength,
    VALIDATION_RULES.title.maxLength
  );

  const descriptionCharCount = getCharacterCountText(
    values.description,
    VALIDATION_RULES.description.minLength,
    VALIDATION_RULES.description.maxLength
  );

  const showTitleError = touched.title && errors.title;
  const showDescriptionError = touched.description && errors.description;
  const showStatusError = touched.status && errors.status;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="text-lg font-semibold text-heading">Basic Information</h3>
        <p className="text-sm text-secondary mt-1">
          Enter the essential details about this property
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-heading mb-1">
          Property Number
        </label>

        <input
          type="text"
          value={values.property_number}
          disabled
          className="mt-1 block w-full rounded-lg border px-3 py-2 bg-hover text-secondary border-border cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-secondary">
          Auto-generated reference number
        </p>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-heading mb-1">

          Status <span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          name="status"
          value={values.status}
          onChange={(e) => setFieldValue('status', e.target.value)}
          onBlur={() => setFieldTouched('status')}
          className={`
            mt-1 block w-full rounded-lg border px-3 py-2 
            bg-card text-text
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            ${showStatusError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border hover:border-secondary'
            }
          `}
        >
          {PROPERTY_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}

        </select>
        {showStatusError && (
          <p className="mt-1 text-sm text-red-500">{errors.status}</p>
        )}
        <p className="mt-1 text-xs text-secondary">
          Only active properties will be visible to users
        </p>
      </div>


      <div>
        <label htmlFor="title" className="block text-sm font-medium text-heading mb-1">

          Property Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={values.title}
          onChange={(e) => setFieldValue('title', e.target.value)}
          onBlur={() => setFieldTouched('title')}
          placeholder="e.g., Luxurious 3-Bedroom Apartment in Lekki Phase 1"
          maxLength={VALIDATION_RULES.title.maxLength + 10} 
          className={`
            mt-1 block w-full rounded-lg border px-3 py-2 
            bg-card text-text placeholder-secondary
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            ${showTitleError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border hover:border-secondary'
            }
          `}
        />
        <div className="mt-1 flex justify-between items-center">
          {showTitleError ? (
            <p className="text-sm text-red-500">{errors.title}</p>
          ) : (
            <p className={`text-xs ${titleCharCount.isError ? 'text-red-500' : titleCharCount.isWarning ? 'text-amber-500' : 'text-secondary'}`}>
              {titleCharCount.text}
            </p>
          )}
        </div>
      </div>

  
      {values.slug && (
        <div>
          <label className="block text-sm font-medium text-heading mb-1">

            URL Slug
          </label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-secondary text-sm">/properties/</span>
            <input
              type="text"
              value={values.slug}
              disabled
              className="flex-1 rounded-lg border px-3 py-2 bg-hover text-secondary border-border cursor-not-allowed text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-secondary">
            Auto-generated from title
          </p>
        </div>
      )}


      <div>
        <label htmlFor="description" className="block text-sm font-medium text-heading mb-1">

          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={(e) => setFieldValue('description', e.target.value)}
          onBlur={() => setFieldTouched('description')}
          placeholder="Describe the property's key features, location benefits, and what makes it special..."
          rows={4}
          maxLength={VALIDATION_RULES.description.maxLength + 20}
          className={`
            mt-1 block w-full rounded-lg border px-3 py-2 
            bg-card text-text placeholder-secondary
            transition-all duration-200 resize-none
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            ${showDescriptionError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-border hover:border-secondary'
            }
          `}
        />
        <div className="mt-1 flex justify-between items-center">
          {showDescriptionError ? (
            <p className="text-sm text-red-500">{errors.description}</p>
          ) : (
            <p className={`text-xs ${descriptionCharCount.isError ? 'text-red-500' : descriptionCharCount.isWarning ? 'text-amber-500' : 'text-secondary'}`}>
              {descriptionCharCount.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );

}

export default BasicInfoSection;