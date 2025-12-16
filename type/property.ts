export interface Property {
  id: string;
  title: string;
  images: string[];
  tag?: 'New Listing' | 'Hot Deal' | 'Luxury';
  price: number;
  deposit: number;
  size: number; // sqm
  bedrooms: number;
  baths: number;
  downPayment: number;
  paymentPeriod: string;
  interestRate: string;
}
