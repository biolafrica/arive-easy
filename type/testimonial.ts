import { StaticImageData } from 'next/image';

export interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  src:| string |StaticImageData;
  author: {
    name: string;
    role: string;
    avatar?: string;
    company?: string;
  };
}
