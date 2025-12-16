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
