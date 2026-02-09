'use client';

import { usePropertyFormContext } from "../PropertyFormContext";
import { getCharacterCountText } from "../functions/validation";
import { PROPERTY_STATUS_OPTIONS, VALIDATION_RULES } from "../pattern/constants";
import * as form from "../pattern/components";

export function BasicInfoSection() {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
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

  return (
    <div className="space-y-6">
      <form.SectionHeader
        title="Basic Information"
        description="Enter the essential details about this property"
      />

      <div>
        <form.FormLabel>Property Number</form.FormLabel>
        <form.FormInput
          type="text"
          value={values.property_number}
          disabled
          helperText="Auto-generated reference number"
        />
      </div>

      <div>
        <form.FormLabel htmlFor="status" required>Status</form.FormLabel>
        <form.FormSelect
          id="status"
          name="status"
          value={values.status}
          onChange={(e) => setFieldValue('status', e.target.value)}
          onBlur={() => setFieldTouched('status')}
          options={PROPERTY_STATUS_OPTIONS}
          error={errors.status}
          showError={touched.status && !!errors.status}
          helperText="Only active properties will be visible to users"
        />
      </div>

      <div>
        <form.FormLabel htmlFor="title" required>Property Title</form.FormLabel>
        <form.FormInput
          type="text"
          id="title"
          name="title"
          value={values.title}
          onChange={(e) => setFieldValue('title', e.target.value)}
          onBlur={() => setFieldTouched('title')}
          placeholder="e.g., Luxurious 3-Bedroom Apartment in Lekki Phase 1"
          maxLength={VALIDATION_RULES.title.maxLength + 10}
          error={errors.title}
          showError={touched.title && !!errors.title}
        />
        {!touched.title || !errors.title ? (
          <p className={`mt-1 text-xs ${
            titleCharCount.isError ? 'text-red-500' : titleCharCount.isWarning 
              ? 'text-amber-500' : 'text-secondary'
          }`}>
            {titleCharCount.text}
          </p>
        ) : null}
      </div>

      {values.slug && (
        <div>
          <form.FormLabel>URL Slug</form.FormLabel>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-secondary text-sm">/properties/</span>
            <form.FormInput
              type="text"
              value={values.slug}
              disabled
              className="flex-1 text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-secondary">Auto-generated from title</p>
        </div>
      )}

      <div>
        <form.FormLabel htmlFor="description" required>Description</form.FormLabel>
        <form.FormTextarea
          id="description"
          name="description"
          value={values.description}
          onChange={(e) => setFieldValue('description', e.target.value)}
          onBlur={() => setFieldTouched('description')}
          placeholder="Describe the property's key features, location benefits, and what makes it special..."
          rows={4}
          maxLength={VALIDATION_RULES.description.maxLength + 20}
          error={errors.description}
          showError={touched.description && !!errors.description}
          characterCount={descriptionCharCount}
        />
      </div>
    </div>
  );
}

export default BasicInfoSection;