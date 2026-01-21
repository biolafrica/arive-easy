'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { INITIAL_PROPERTY_VALUES, Property, PropertyCreatePayload, PropertyFormErrors, PropertyFormValues } from './pattern/types';
import { generateFullAddress, generatePropertyNumber, generateSlug } from './pattern/constants';
import { isFormValid, validatePropertyForm } from './functions/validation';

interface UsePropertyFormOptions {
  initialValues?: Partial<PropertyFormValues>;
  onSubmit: (payload: PropertyCreatePayload) => Promise<void>;
  mode?: 'create' | 'edit';
  propertyId?: string;
}

interface UsePropertyFormReturn {
  values: PropertyFormValues;
  errors: PropertyFormErrors;
  touched: Partial<Record<string, boolean>>;
  isSubmitting: boolean;
  globalError: string;
  
  setFieldValue: (name: keyof PropertyFormValues, value: any) => void;
  setFieldTouched: (name: keyof PropertyFormValues, touched?: boolean) => void;
  setGlobalError: (error: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
  
  isValid: boolean;
  isDirty: boolean;
  
  mode: 'create' | 'edit';
  propertyId?: string;
}

export function usePropertyForm({ initialValues, onSubmit, mode = 'create', propertyId }: UsePropertyFormOptions): UsePropertyFormReturn {
  
  const mergedInitialValues = useMemo(() => ({
    ...INITIAL_PROPERTY_VALUES,
    ...initialValues,
    property_number: initialValues?.property_number || (mode === 'create' ? generatePropertyNumber() : ''),
  }), [initialValues, mode]);

  const [values, setValues] = useState<PropertyFormValues>(mergedInitialValues);
  const [errors, setErrors] = useState<PropertyFormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<string, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setValues(mergedInitialValues);
    setErrors({});
    setTouched({});
    setGlobalError('');
    setIsDirty(false);
  }, [mergedInitialValues]);

  useEffect(() => {
    const validationErrors = validatePropertyForm(values);
    setErrors(validationErrors);
  }, [values]);

  useEffect(() => {
    if (values.title && mode === 'create') {
      const newSlug = generateSlug(values.title);
      if (newSlug !== values.slug) {
        setValues(prev => ({ ...prev, slug: newSlug }));
      }
    }
  }, [values.title, values.slug, mode]);

  useEffect(() => {
    const newAddress = generateFullAddress(
      values.street,
      values.city,
      values.state,
      values.country
    );
    
    if (newAddress !== values.address_full && (values.city || values.state)) {
      setValues(prev => ({ ...prev, address_full: newAddress }));
    }
  }, [values.street, values.city, values.state, values.country, values.address_full]);

  const setFieldValue = useCallback((name: keyof PropertyFormValues, value: any) => {
    setValues(prev => {
      const newValue = typeof value === 'function' ? value(prev[name]) : value;
      return { ...prev, [name]: newValue };
    });
    setTouched(prev => ({ ...prev, [name]: true }));
    setIsDirty(true);
    setGlobalError('');
  }, []);

  const setFieldTouched = useCallback((name: keyof PropertyFormValues, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(mergedInitialValues);
    setErrors({});
    setTouched({});
    setGlobalError('');
    setIsDirty(false);
  }, [mergedInitialValues]);

  const preparePayload = useCallback((): PropertyCreatePayload => {
    const imageUrls = values.images
    .filter(img => img.url)
    .map(img => img.url!);

    const tours = (values.tours?.video?.url || values.tours?.virtual3D?.url)
    ? {
        video: values.tours?.video?.url
        ? { url: values.tours.video.url, provider: 'youtube', thumbnail: values.tours.video.thumbnail}
        : undefined, virtual3D: values.tours?.virtual3D?.url
        ? { url: values.tours.virtual3D.url, provider: 'custom' }
        : undefined,
      }
    : null;

    return {
      slug: values.slug,
      title: values.title.trim(),
      status: values.status,
      description: values.description.trim(),
      property_number: values.property_number,
      
      address_full: values.address_full,
      street: values.street?.trim() || null,
      state: values.state,
      city: values.city,
      country: values.country,
      
      price: values.price,
      property_type: values.property_type,
      interior: values.interior || null,
      area_sqm: values.area_sqm || null,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      
      images: imageUrls,
      tours,
      amenities: values.amenities,
      listing_tag: values.listing_tag || null,
      
      seo_title: values.seo_title?.trim() || null,
      seo_description: values.seo_description?.trim() || null,
      seo_image: values.seo_image || null,
    };
  }, [values]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    ) as Partial<Record<string, boolean>>;
    setTouched(allTouched);
    
    const validationErrors = validatePropertyForm(values);
    setErrors(validationErrors);
    
    if (!isFormValid(validationErrors)) {
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const hasUnuploadedImages = values.images.some(img => img.file && !img.url);
    if (hasUnuploadedImages) {
      setGlobalError('Please wait for all images to finish uploading');
      return;
    }
    
    setIsSubmitting(true);
    setGlobalError('');
    
    try {
      const payload = preparePayload();
      await onSubmit(payload);
      
      setIsDirty(false);
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'An unexpected error occurred';
      setGlobalError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, preparePayload, onSubmit]);

  const isValid = useMemo(() => isFormValid(errors), [errors]);

  return {
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
    mode,
    propertyId,
  };
}

export function usePropertyFormEdit(property: Property | null | undefined) {
  const initialValues = useMemo((): Partial<PropertyFormValues> | undefined => {
    if (!property) return undefined;
    
    return {
      slug: property.slug,
      property_number: property.property_number,
      address_full: property.address_full,
      
      title: property.title,
      status: property.status,
      description: property.description,
      
      street: property.street || '',
      state: property.state,
      city: property.city,
      country: property.country,
      
      price: property.price,
      property_type: property.property_type,
      interior: property.interior || '',
      area_sqm: property.area_sqm || '',
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      
      images: property.images.map((url, index) => ({
        id: `existing-${index}`, url, file: undefined, isUploading: false,
      })),
      
      tours: property.tours || { video: undefined, virtual3D: undefined },
      amenities: property.amenities,
      listing_tag: property.listing_tag || '',
      
      seo_title: property.seo_title || '',
      seo_description: property.seo_description || '',
      seo_image: property.seo_image || '',
    };
  }, [property]);
  
  return initialValues;
}

export default usePropertyForm;