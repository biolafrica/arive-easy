import { PropertyData } from "@/type/pages/property";

export const FEATURED_PROPERTIES: PropertyData[] = [
  {
    id: 'prop-1',
    title: 'Mary Keyes Residence',
    images: [
      '/images/house-1.jpg',
      '/images/house-1.jpg',
      '/images/house-1.jpg',
      '/images/house-1.jpg',
    ],
    listing_tag: 'New Listing',
    price: '60950000',
    deposit: '3950000',
    area_sqm: '1500',
    bedrooms: 4,
    bathrooms: 3,
    down_payment: '21000000',
    payment_period: '4–30',
    interest_rate: '4',
  },

  {
    id: 'prop-2',
    title: 'Pearl Residence',
    images: [
     '/images/house-2.jpg',
      '/images/house-2.jpg',
      '/images/house-2.jpg',
      '/images/house-2.jpg',
    ],
    listing_tag: 'Hot Deal',
    price: '60950000',
    deposit: '3950000',
    area_sqm: '1500',
    bedrooms: 4,
    bathrooms: 3,
    down_payment: '21000000',
    payment_period: '4–30',
    interest_rate: '4%',
  },

  {
    id: 'prop-3',
    title: 'Emerald Heights Villa',
    images: [
     '/images/house-3.jpg',
      '/images/house-3.jpg',
      '/images/house-3.jpg',
      '/images/house-3.jpg',
    ],
    listing_tag: 'Luxury',
    price: '125000000',
    deposit: '10000000',
    area_sqm: '2200',
    bedrooms: 5,
    bathrooms: 4,
    down_payment: '35000000',
    payment_period: '5–25',
    interest_rate: '3.5',
  },
];

export const mockSingleProperty = {
  id: 'property-001',
  slug: 'mary-keyes-residence',
  title: 'Mary Keyes Residence',

  address_full: '15 Mary Keyes Street, Victoria Island, Lagos, Nigeria',
  street:'15 Mary Keyes Street',
  city: 'Victoria Island',
  state: 'Lagos',
  country: 'Nigeria',
  status: 'Move-in Ready',
  currency : 'NGN',
  images: [
    '/images/house-1.jpg', 
    '/images/house-2.jpg', 
    '/images/house-3.jpg', 
    '/images/house-1.jpg',
  ],
  
  tours: {
    video: {
      url: 'https://www.youtube.com/watch?v=abcdef12345',
      provider: 'youtube',
      thumbnail: '/images/properties/mary-keyes/video-thumb.jpg',
    },

    virtual3D: {
      url: 'https://my.matterport.com/show/?m=XYZ123',
      provider: 'matterport',
    },
  },
  price: '500000000',
  deposit: '380000000',
  down_payment: '360000000',
  payment_period: '4 – 30',
  interest_rate: '6.7',
  estimated_monthly_payment: null,
  roi_estimate:null,
  listing_tag: 'Luxury',
  is_featured: true,
  is_active: true,
  area_sqm: '1500',
  bedrooms: 4,
  bathrooms: 3,
  developer_id: null,
  created_by: '12345678689',
  approved_by: null,
  approved_at: null,
  propert_type: 'Detached House',
  interior: 'Fully Furnished',
  description:
    'A stunning 4-bedroom luxury residence located in the heart of Victoria Island, offering premium finishes and modern amenities.',

  amenities: [
    'Swimming Pool','Gym / Fitness Center', '24/7 Security','High-Speed Internet',
    'Garden & Landscaping','Backup Generator', 'Parking Space','Balcony / Terrace',
  ],
  seo_title: null,
  seo_description: null,
  seo_image: null,
  created_at: null,
  updated_at: null,
};

