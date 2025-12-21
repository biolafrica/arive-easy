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
    maximumFractionDigits: 20  // preserve decimals if present
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
