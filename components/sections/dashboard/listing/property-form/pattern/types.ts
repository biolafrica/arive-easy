
import { PropertyStatus } from './constants';

export interface PropertyVideoTour {
  url: string;
  provider?: string;
  thumbnail?: string;
}

export interface PropertyVirtual3DTour {
  url: string;
  provider?: string;
}

export interface PropertyTours {
  video?: PropertyVideoTour;
  virtual3D?: PropertyVirtual3DTour;
}

export interface PropertyImage {
  id: string;
  file?: File;
  url?: string;
  isUploading?: boolean;
  error?: string;
}


export interface PropertyFormValues {
  slug: string;
  property_number: string;
  address_full: string;

  title: string;
  status: PropertyStatus;
  description: string;
  
  street: string;
  state: string;
  city: string;
  country: string;
  
  price: string;
  property_type: string;
  interior: string;
  area_sqm: string;
  bedrooms: number;
  bathrooms: number;
  
  images: PropertyImage[];
  tours: PropertyTours;
  
  amenities: string[];
  listing_tag: string;
  
  seo_title: string;
  seo_description: string;
  seo_image: string;
}


export type PropertyFormErrors = Partial<Record<keyof PropertyFormValues, string>> & {
  'tours.video'?: string;
  'tours.virtual3D'?: string;
};


export interface FormSectionProps {
  values: PropertyFormValues;
  errors: PropertyFormErrors;
  touched: Partial<Record<string, boolean>>;
  onChange: (name: keyof PropertyFormValues, value: any) => void;
  onBlur: (name: keyof PropertyFormValues) => void;
}

export const INITIAL_PROPERTY_VALUES: PropertyFormValues = {
  slug: '',
  property_number: '',
  address_full: '',
  
  title: '',
  status: 'inactive',
  description: '',
  
  street: '',
  state: '',
  city: '',
  country: 'Nigeria',
  
  price: '',
  property_type: '',
  interior: '',
  area_sqm: '',
  bedrooms: 0,
  bathrooms: 0,
  
  images: [],
  tours: {
    video: undefined,
    virtual3D: undefined,
  },
  
  amenities: [],
  listing_tag: '',
  
  seo_title: '',
  seo_description: '',
  seo_image: '',
};


export interface PropertyCreatePayload {
  slug: string;
  title: string;
  status: PropertyStatus;
  description: string;
  property_number: string;
  
  address_full: string;
  street?: string | null;
  state: string;
  city: string;
  country: string;
  
  price: string;
  property_type: string;
  interior?: string | null;
  area_sqm?: string | null;
  bedrooms: number;
  bathrooms: number;
  
  images: string[];
  tours?: PropertyTours | null;
  amenities: string[];
  listing_tag?: string | null;
  
  seo_title?: string | null;
  seo_description?: string | null;
  seo_image?: string | null;
}


export interface Property extends PropertyCreatePayload {
  id: string;
  developer_id?: string | null;
  created_at: string;
  updated_at: string;
  offers:number;
  views:number;
}