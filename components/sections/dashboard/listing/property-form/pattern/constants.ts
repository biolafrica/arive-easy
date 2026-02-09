import { SelectOption } from "./components";


export const PROPERTY_STATUS_OPTIONS:SelectOption[]  = [
  { value: '', label: 'Select status', disabled: true },
  { value: 'active', label: 'Active', disabled:false },
  { value: 'inactive', label: 'Inactive', disabled:false },
] as const;

export type PropertyStatus = 'active' | 'inactive';


export const STATES:SelectOption[]= [
  { value: '', label: 'Select state', disabled: true },
  { value: 'lagos', label: 'Lagos', disabled: false },
  { value: 'abuja', label: 'Abuja', disabled: false  },
  { value: 'ogun', label: 'Ogun', disabled: false },
] as const;

export const CITIES_BY_STATE: Record<string, Array<{ value: string; label: string; disabled?: boolean }>> = {
  '': [{ value: '', label: 'Select state first', disabled: true }],
  lagos: [
    { value: '', label: 'Select city', disabled: true },
    { value: 'island', label: 'Island' },
    { value: 'mainland', label: 'Mainland' },
    { value: 'ikeja', label: 'Ikeja' },
    { value: 'lekki', label: 'Lekki' },
    { value: 'vi', label: 'Victoria Island' },
    { value: 'ikoyi', label: 'Ikoyi' },
    { value: 'ajah', label: 'Ajah' },
    { value: 'yaba', label: 'Yaba' },
    { value: 'surulere', label: 'Surulere' },
  ],
  abuja: [
    { value: '', label: 'Select city', disabled: true },
    { value: 'maitama', label: 'Maitama' },
    { value: 'wuse', label: 'Wuse' },
    { value: 'gwarimpa', label: 'Gwarimpa' },
    { value: 'asokoro', label: 'Asokoro' },
    { value: 'garki', label: 'Garki' },
    { value: 'jabi', label: 'Jabi' },
    { value: 'utako', label: 'Utako' },
    { value: 'katampe', label: 'Katampe' },
  ],
  ogun: [
    { value: '', label: 'Select city', disabled: true },
    { value: 'abeokuta', label: 'Abeokuta' },
    { value: 'sagamu', label: 'Sagamu' },
    { value: 'ibafo', label: 'Ibafo' },
    { value: 'ota', label: 'Ota' },
    { value: 'ijebu-ode', label: 'Ijebu Ode' },
    { value: 'ilaro', label: 'Ilaro' },
  ],
};


export const PROPERTY_TYPES:SelectOption[] = [
  { value: '', label: 'Select property type', disabled: true },
  { value: 'apartment', label: 'Apartment', disabled: false },
  { value: 'detached', label: 'Detached House', disabled: false },
  { value: 'semi-detached', label: 'Semi-Detached', disabled: false },
  { value: 'terrace', label: 'Terrace', disabled: false },
  { value: 'land', label: 'Land', disabled: false },
  { value: 'duplex', label: 'Duplex', disabled: false },
  { value: 'penthouse', label: 'Penthouse', disabled: false },
  { value: 'bungalow', label: 'Bungalow', disabled: false },
] as const;


export const INTERIOR_OPTIONS:SelectOption[] = [
  { value: '', label: 'Select interior type', disabled: true },
  { value: 'furnished', label: 'Fully Furnished', disabled: false },
  { value: 'semi-furnished', label: 'Semi-Furnished', disabled: false },
  { value: 'unfurnished', label: 'Unfurnished', disabled: false },
] as const;


export const LISTING_TAGS:SelectOption[] = [
  { value: '', label: 'No tag' },
  { value: 'hot-deal', label: 'Hot Deal' },
  { value: 'new-listing', label: 'New Listing' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'reduced', label: 'Price Reduced' },
  { value: 'featured', label: 'Featured' },
] as const;


export const AMENITIES = [
  { id: 'swimming-pool', label: 'Swimming Pool', icon: '🏊' },
  { id: 'gym', label: 'Gym / Fitness Center', icon: '🏋️' },
  { id: 'security', label: '24/7 Security', icon: '🛡️' },
  { id: 'internet', label: 'High-Speed Internet', icon: '📶' },
  { id: 'garden', label: 'Garden & Landscaping', icon: '🌳' },
  { id: 'generator', label: 'Backup Generator', icon: '⚡' },
  { id: 'parking', label: 'Parking Space', icon: '🚗' },
  { id: 'balcony', label: 'Balcony / Terrace', icon: '🏠' },
  { id: 'air-conditioning', label: 'Air Conditioning', icon: '❄️' },
  { id: 'elevator', label: 'Elevator', icon: '🛗' },
  { id: 'cctv', label: 'CCTV Surveillance', icon: '📹' },
  { id: 'water', label: 'Borehole / Water Supply', icon: '💧' },
  { id: 'smart-home', label: 'Smart Home Features', icon: '🏠' },
  { id: 'servant-quarters', label: 'Servant Quarters', icon: '🏘️' },
  { id: 'laundry', label: 'Laundry Room', icon: '🧺' },
] as const;


export const VALIDATION_RULES = {
  title: { minLength: 30, maxLength: 50, required: true },
  description: { minLength: 100, maxLength: 200, required: true },
  price: { min: 1000, max: 100000000, required: true },
  bedrooms: { min: 0, max: 20, required: true },
  bathrooms: { min: 0, max: 20, required: true },
  images: { minCount: 1, maxCount: 4,
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    required: true,
  },
  area_sqm: { min: 10, max: 100000, required: false },
  seo_title: { maxLength: 60, required: false },
  seo_description: { maxLength: 160, required: false },
} as const;


export const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+(&[\w=]*)*$/;


export function generateSlug(title: string): string {
  return title
  .toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '') 
  .replace(/\s+/g, '-') 
  .replace(/-+/g, '-') 
  .substring(0, 100); 
}


export function generatePropertyNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `PROP-${year}${month}${day}-${timestamp}${random}`;
}


export function generateFullAddress(
  street: string | null | undefined,
  city: string,
  state: string,
  country: string = 'Nigeria'
): string {
  const parts = [street, city, state, country].filter(Boolean);
  
  return parts
  .map(part => 
    part!.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  )
  .join(', ');
}


export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
}

export function getCityLabel(state: string, city: string): string {
  const cities = CITIES_BY_STATE[state] || [];
  const found = cities.find(c => c.value === city);
  return found?.label || city;
}

export function getStateLabel(state: string): string {
  const found = STATES.find(s => s.value === state);
  return found?.label || state;
}