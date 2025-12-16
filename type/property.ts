export interface Property {
  id: string;
  title: string;
  images: string[];
  tag?: 'New Listing' | 'Hot Deal' | 'Luxury';
  price: number;
  deposit: number;
  size: number;
  bedrooms: number;
  baths: number;
  downPayment: number;
  paymentPeriod: string;
  interestRate: string;
}

export type VideoTourProvider = 'youtube' | 'vimeo' | 'self';
export type Virtual3DProvider = 'matterport' | 'custom';

export interface PropertyVideoTour {
  url: string;
  provider?: VideoTourProvider;
  thumbnail?: string;
}

export interface PropertyVirtual3DTour {
  url: string;
  provider?: Virtual3DProvider;
}

export interface PropertyTours {
  video?: PropertyVideoTour;
  virtual3D?: PropertyVirtual3DTour;
}

export interface PropertyRow {
  id: string;
  slug: string;
  title: string;
  status: string;
  description: string;

  address_full: string;
  street?: string | null;
  city: string;
  state: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;

  price: number;
  currency: string;
  deposit: number;
  down_payment: number;
  payment_period: string;
  interest_rate: string;
  estimated_monthly_payment?: number | null;
  roi_estimate?: string | null;

  property_type: string;
  interior?: string | null;
  area_sqm?: number | null;
  bedrooms: number;
  bathrooms: number;
  parking_spaces?: number | null;

  images: string[];
  tours?: PropertyTours | null;
  amenities: string[];

  listing_tag?: string | null;
  is_featured: boolean;
  is_active: boolean;

  developer_id?: string | null;
  created_by: string;
  approved_by?: string | null;
  approved_at?: string | null;

  seo_title?: string | null;
  seo_description?: string | null;
  seo_image?: string | null;

  created_at: string;
  updated_at: string;
}
