import { InfoCard, InfoItem } from "@/components/common/Item";
import {formatUSD, toNumber } from "@/lib/formatter";
import { PropertyPricingProps } from "@/type/pages/property";


export function PropertyPricing({
  price,
  deposit,
  down_payment,
  payment_period,
  interest_rate,
}: PropertyPricingProps) {
  const depositAmount = toNumber(price) * 0.1;
  return (
    <InfoCard title="Pricing">
      <InfoItem label="Property Price" value={formatUSD({amount:toNumber(price), decimals:2})} />
      <InfoItem label="Deposit Required" value={formatUSD({amount:depositAmount, decimals:2})} />
      <InfoItem label="Payment Period" value={`0 - 20 years`} />
      <InfoItem label="Interest Rate" value={`10% p.a`} />
    </InfoCard>
  );
}



