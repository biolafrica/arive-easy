'use client';

import { usePropertyForm, usePropertyFormEdit } from './usePropertyForm';
import { PropertyFormProvider } from './PropertyFormContext';
import { Button } from '@/components/primitives/Button';
import apiClient from '@/lib/api-client';
import { Property, PropertyCreatePayload } from './pattern/types';
import BasicInfoSection from './sections/BasicInfoSection';
import LocationSection from './sections/LocationSection';
import DetailsSection from './sections/DetailsSection';
import MediaSection from './sections/MediaSection';
import AmenitiesSection from './sections/AmenitiesSection';
import SEOSection from './sections/SEOSection';


interface PropertyFormProps {
  property?: Property | null;
  
  onSubmit: (payload: PropertyCreatePayload) => Promise<void>;
  onCancel?: () => void;
  
  submitLabel?: string;
  cancelLabel?: string;
  
  className?: string;
}

export function PropertyForm({
  property,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel = 'Cancel',
  className = '',
}: PropertyFormProps) {
  const mode = property ? 'edit' : 'create';
  const initialValues = usePropertyFormEdit(property);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    globalError,
    setFieldValue,
    setFieldTouched,
    setGlobalError,
    handleSubmit,
    resetForm,
    isValid,
    isDirty,
    propertyId,
  } = usePropertyForm({
    initialValues: initialValues || undefined, onSubmit, mode, propertyId: property?.id,
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    const url = await apiClient.uploadToSupabase(file, 'media', 'properties');
    if (!url) {
      throw new Error('Failed to upload image');
    }
    return url;
  };

  const finalSubmitLabel = submitLabel || (mode === 'edit' ? 'Update Property' : 'Create Property');

  return (
    <PropertyFormProvider
      values={values}
      errors={errors}
      touched={touched}
      isSubmitting={isSubmitting}
      globalError={globalError}
      setFieldValue={setFieldValue}
      setFieldTouched={setFieldTouched}
      setGlobalError={setGlobalError}
      isValid={isValid}
      mode={mode}
      propertyId={property?.id}
    >
      <form onSubmit={handleSubmit} className={`space-y-8 ${className}`}>
        {globalError && (
          <div className="border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg flex items-start gap-3">
            <svg
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{globalError}</p>
            </div>
            <button
              type="button"
              onClick={() => setGlobalError('')}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="bg-card rounded-xl border border-border p-6">
          <BasicInfoSection />
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <LocationSection />
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <DetailsSection/>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <MediaSection onUpload={handleImageUpload} />
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <AmenitiesSection />
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <SEOSection />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="sm:order-1"
            >
              {cancelLabel}
            </Button>
          )}
          
          <Button
            type="submit"
            variant="filled"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            loadingText={mode === 'edit' ? 'Updating...' : 'Creating...'}
            className="sm:order-2 sm:ml-auto"
          >
            {finalSubmitLabel}
          </Button>
        </div>

        {isDirty && !isSubmitting && (
          <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
            You have unsaved changes
          </p>
        )}
      </form>
    </PropertyFormProvider>
  );
}

export default PropertyForm;