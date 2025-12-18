export const STATES = {
  Lagos: ['Victoria Island', 'Lekki', 'Ikoyi', 'Yaba'],
  Abuja: ['Maitama', 'Wuse', 'Gwarimpa'],
  Ogun: ['Abeokuta', 'Sagamu'],
} as const;

export const PROPERTY_TYPES = [
  'Apartment',
  'Detached House',
  'Semi-Detached',
  'Terrace',
  'Land',
];

export const PRICE_RANGES = [
  { label: '₦20m – ₦50m', value: '20-50' },
  { label: '₦50m – ₦100m', value: '50-100' },
  { label: '₦100m – ₦300m', value: '100-300' },
  { label: '₦300m+', value: '300+' },
];
