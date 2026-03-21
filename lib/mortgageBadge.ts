import { BadgeProps } from "@/components/primitives/Badge";

type PaymentStatus = 'scheduled' | 'succeeded' | 'failed' | 'processing';

const paymentStatusVariant: Record<PaymentStatus, BadgeProps['variant']> = {
  succeeded: 'success',
  failed: 'destructive',
  scheduled: 'info',
  processing: 'warning',
};

export function getPaymentStatusBadge(status: string) {
  const variant = paymentStatusVariant[status as PaymentStatus] ?? 'secondary';
  return { variant, label: status.charAt(0).toUpperCase() + status.slice(1) };
}