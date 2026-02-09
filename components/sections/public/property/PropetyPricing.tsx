import { InfoCard, InfoItem } from "@/components/common/Item";
import { formatNaira } from "@/lib/formatter";
import { PropertyPricingProps } from "@/type/pages/property";


export function PropertyPricing({
  price,
  deposit,
  down_payment,
  payment_period,
  interest_rate,
}: PropertyPricingProps) {
  return (
    <InfoCard title="Pricing">
      <InfoItem label="Property Price" value={formatNaira(price)} />
      <InfoItem label="Deposit Required" value={formatNaira(deposit)} />
      <InfoItem label="Down Payment" value={formatNaira(down_payment)} />
      <InfoItem label="Payment Period" value={`${payment_period} years`} />
      <InfoItem label="Interest Rate" value={`${interest_rate}% p.a`} />
    </InfoCard>
  );
}



