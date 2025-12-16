import { Property } from "@/type/property";

export const FEATURED_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Mary Keyes Residence',
    images: [
      '/images/house-1.jpg',
      '/images/house-1.jpg',
      '/images/house-1.jpg',
      '/images/house-1.jpg',
    ],
    tag: 'New Listing',
    price: 60950000,
    deposit: 3950000,
    size: 1500,
    bedrooms: 4,
    baths: 3,
    downPayment: 21000000,
    paymentPeriod: '4–30 Years',
    interestRate: '4% p.a',
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
    tag: 'Hot Deal',
    price: 60950000,
    deposit: 3950000,
    size: 1500,
    bedrooms: 4,
    baths: 3,
    downPayment: 21000000,
    paymentPeriod: '4–30 Years',
    interestRate: '4% p.a',
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
    tag: 'Luxury',
    price: 125000000,
    deposit: 10000000,
    size: 2200,
    bedrooms: 5,
    baths: 4,
    downPayment: 35000000,
    paymentPeriod: '5–25 Years',
    interestRate: '3.5% p.a',
  },
];

export const mockSingleProperty = {
  id: 'property-001',
  slug: 'mary-keyes-residence',

  title: 'Mary Keyes Residence',

  address: {
    full: '15 Mary Keyes Street, Victoria Island, Lagos, Nigeria',
    city: 'Victoria Island',
    state: 'Lagos',
    country: 'Nigeria',
  },

  status: 'Move-in Ready',

  gallery: {
    images: [
      '/images/properties/mary-keyes/1.jpg',
      '/images/properties/mary-keyes/2.jpg',
      '/images/properties/mary-keyes/3.jpg',
      '/images/properties/mary-keyes/4.jpg',
    ],
  },

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

  pricing: {
    price: '₦500,000,000',
    deposit: '₦380,000,000',
    downPayment: '₦360,000,000',
    paymentPeriod: '4 – 30 years',
    interestRate: '6.7% pa',
  },

  details: {
    area: '1500 sqm',
    bedrooms: 4,
    bathrooms: 3,
    type: 'Detached House',
    interior: 'Fully Furnished',
  },

  description:
    'A stunning 4-bedroom luxury residence located in the heart of Victoria Island, offering premium finishes and modern amenities.',

  amenities: [
    'Swimming Pool',
    'Gym / Fitness Center',
    '24/7 Security',
    'High-Speed Internet',
    'Garden & Landscaping',
    'Backup Generator',
    'Parking Space',
    'Balcony / Terrace',
  ],
};

