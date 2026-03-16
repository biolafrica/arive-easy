import { SelectOption } from "@/components/sections/dashboard/listing/property-form";

export const PRICE_RANGES: SelectOption[] = [
  { value: '',        label: 'Select price range', disabled: true },
  { value: '20-50',   label: '₦20M – ₦50M' },
  { value: '50-100',  label: '₦50M – ₦100M' },
  { value: '100-300',label: '₦100M – ₦300M' },
  { value: '300+',    label: '₦300M+' },
];


export const STATUS_OPTIONS:SelectOption[]  = [
  { value: '', label: 'Select status', disabled: true },
  { value: 'active', label: 'Active', disabled:false },
  { value: 'offers', label: 'Pending', disabled:false },
  { value: 'sold', label: 'Sold', disabled:false },
] as const;