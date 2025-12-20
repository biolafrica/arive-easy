export type VideoTourProvider = 'youtube' | 'vimeo' | 'self';
export type Virtual3DProvider = 'matterport' | 'custom';

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

export interface PropertyBase {
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

  price: string;
  currency: string;
  deposit: string;
  down_payment: string;
  payment_period: string;
  interest_rate: string;
  estimated_monthly_payment?: string | null;
  roi_estimate?: string | null;

  property_type: string;
  interior?: string | null;
  area_sqm?: string | null;
  bedrooms: number;
  bathrooms: number;

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

export type PropertyForm = Pick<PropertyBase, 'title' | 'status' | 'description' | 'state' | 'price' | 'property_type' | 'city'>
export type PropertyData = Pick<PropertyBase, 'id' |'title'|'images'|'listing_tag'|'price'|'deposit'|'area_sqm'|'bedrooms' |'bathrooms'|'down_payment'|'payment_period'|'interest_rate' >
export type PropertyPricingProps = Pick<PropertyBase, 'price' | 'deposit' | 'down_payment' | 'payment_period' | 'interest_rate'>
export type PropertyDetailsProps = Pick<PropertyBase, 'address_full' | 'area_sqm' | 'bedrooms' | 'bathrooms' | 'property_type' | 'interior'>
export type PropertyTourCardProps = Pick<PropertyBase, 'images' | 'tours'> &{
  video :boolean
}
export type PropertyGalleryProps = PropertyTourCardProps
export type PropertyAmenitiesProps = Pick<PropertyBase, 'amenities'>
