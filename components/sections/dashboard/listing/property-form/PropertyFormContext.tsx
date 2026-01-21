'use client';

import { createContext, useContext, ReactNode } from 'react';
import { PropertyFormErrors, PropertyFormValues, PropertyImage } from './pattern/types';


interface PropertyFormContextType {
  values: PropertyFormValues;
  errors: PropertyFormErrors;
  touched: Partial<Record<string, boolean>>;
  isSubmitting: boolean;
  globalError: string;
  
  setFieldValue: (name: keyof PropertyFormValues, value: any) => void;
  setFieldTouched: (name: keyof PropertyFormValues, touched?: boolean) => void;
  setGlobalError: (error: string) => void;
  
  addImage: (image: PropertyImage) => void;
  removeImage: (imageId: string) => void;
  updateImage: (imageId: string, updates: Partial<PropertyImage>) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;

  setVideoTour: (url: string) => void;
  clearVideoTour: () => void;
  setVirtual3DTour: (url: string) => void;
  clearVirtual3DTour: () => void;
  
  toggleAmenity: (amenityId: string) => void;
  
  isValid: boolean;
  characterCounts: {
    title: number;
    description: number;
    seo_title: number;
    seo_description: number;
  };
  
  mode: 'create' | 'edit';
  propertyId?: string;
}

const PropertyFormContext = createContext<PropertyFormContextType | null>(null);

interface PropertyFormProviderProps {
  children: ReactNode;
  values: PropertyFormValues;
  errors: PropertyFormErrors;
  touched: Partial<Record<string, boolean>>;
  isSubmitting: boolean;
  globalError: string;
  setFieldValue: (name: keyof PropertyFormValues, value: any) => void;
  setFieldTouched: (name: keyof PropertyFormValues, touched?: boolean) => void;
  setGlobalError: (error: string) => void;
  isValid: boolean;
  mode: 'create' | 'edit';
  propertyId?: string;
}

export function PropertyFormProvider({
  children,
  values,
  errors,
  touched,
  isSubmitting,
  globalError,
  setFieldValue,
  setFieldTouched,
  setGlobalError,
  isValid,
  mode,
  propertyId,
}: PropertyFormProviderProps) {
  
  const addImage = (image: PropertyImage) => {
    const currentImages = values.images || [];
    if (currentImages.length < 4) {
      setFieldValue('images', [...currentImages, image]);
    }
  };

  const removeImage = (imageId: string) => {
    const currentImages = values.images || [];
    setFieldValue('images', currentImages.filter(img => img.id !== imageId));
  };

  const updateImage = (imageId: string, updates: Partial<PropertyImage>) => {
    const currentImages = values.images || [];
    setFieldValue(
      'images',
      currentImages.map(img => (img.id === imageId ? { ...img, ...updates } : img))
    );
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const currentImages = [...(values.images || [])];
    const [movedImage] = currentImages.splice(fromIndex, 1);
    currentImages.splice(toIndex, 0, movedImage);
    setFieldValue('images', currentImages);
  };


  const setVideoTour = (url: string) => {
    setFieldValue('tours', {
      ...values.tours,
      video: {
        url,
        provider: 'youtube',
        thumbnail: extractYouTubeThumbnail(url),
      },
    });
  };

  const clearVideoTour = () => {
    setFieldValue('tours', {
      ...values.tours,
      video: undefined,
    });
  };

  const setVirtual3DTour = (url: string) => {
    setFieldValue('tours', {
      ...values.tours,
      virtual3D: {
        url,
        provider: 'custom',
      },
    });
  };

  const clearVirtual3DTour = () => {
    setFieldValue('tours', {
      ...values.tours,
      virtual3D: undefined,
    });
  };


  const toggleAmenity = (amenityId: string) => {
    const currentAmenities = values.amenities || [];
    const isSelected = currentAmenities.includes(amenityId);
    
    if (isSelected) {
      setFieldValue('amenities', currentAmenities.filter(id => id !== amenityId));
    } else {
      setFieldValue('amenities', [...currentAmenities, amenityId]);
    }
  };

  const characterCounts = {
    title: values.title?.length || 0,
    description: values.description?.length || 0,
    seo_title: values.seo_title?.length || 0,
    seo_description: values.seo_description?.length || 0,
  };


  const contextValue: PropertyFormContextType = {
    values,
    errors,
    touched,
    isSubmitting,
    globalError,
    setFieldValue,
    setFieldTouched,
    setGlobalError,
    addImage,
    removeImage,
    updateImage,
    reorderImages,
    setVideoTour,
    clearVideoTour,
    setVirtual3DTour,
    clearVirtual3DTour,
    toggleAmenity,
    isValid,
    characterCounts,
    mode,
    propertyId,
  };

  return (
    <PropertyFormContext.Provider value={contextValue}>
      {children}
    </PropertyFormContext.Provider>
  );
}

export function usePropertyFormContext() {
  const context = useContext(PropertyFormContext);
  
  if (!context) {
    throw new Error('usePropertyFormContext must be used within a PropertyFormProvider');
  }
  
  return context;
}

function extractYouTubeThumbnail(url: string): string | undefined {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
  }
  
  return undefined;
}

export default PropertyFormContext;