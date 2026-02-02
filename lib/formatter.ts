export const formatNaira =(amount:any)=>{
  if(isNaN(amount)){
    return "Invalid Amount"
  }

  return new Intl.NumberFormat('en-NG', {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);

}

export function formatNumber(value:any) {
  if (value == null || isNaN(value)) return 'Inavlid Number'
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 20 
  }).format(value)
}

export function toNumber(
  value: unknown,
  options?: {
    fallback?: number;
    allowFloat?: boolean;
    min?: number;
    max?: number;
  }
): number {
  const {
    fallback = 0,
    allowFloat = true,
    min,
    max,
  } = options ?? {};

  if (value === null || value === undefined) {
    return fallback;
  }

  let num: number;

  if (typeof value === 'number') {
    num = value;
  } else if (typeof value === 'string') {
    const cleaned = value.trim();

    if (cleaned === '') return fallback;

    num = allowFloat ? Number(cleaned) : parseInt(cleaned, 10);
  } else {
    return fallback;
  }

  if (!Number.isFinite(num)) {
    return fallback;
  }

  if (typeof min === 'number' && num < min) return fallback;
  if (typeof max === 'number' && num > max) return fallback;

  return num;
}


export function formatDate(
  date: string | number | Date,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  if (!date) return "";

  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    console.warn("Invalid date supplied to formatDate:", date);
    return "";
  }

  return d.toLocaleDateString(locale, options);
}


export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUSD({
  amount,
  fromCents = false,
  decimals = 0,
}: {
  amount: number;
  fromCents?: boolean;
  decimals?: 0 | 2;
}): string {
  const value = fromCents ? amount / 100 : amount;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatTime(
  date: string | number | Date,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
): string {
  if (!date) return "";

  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    console.warn("Invalid date supplied to formatTime:", date);
    return "";
  }

  return d.toLocaleTimeString(locale, options);
}


export function parseCurrencyInput(value: string): number {
  const cleanedValue = value.replace(/[^0-9.]/g, '');
  return parseFloat(cleanedValue) || 0;
}

export function formatNumberDate(dateString?: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}