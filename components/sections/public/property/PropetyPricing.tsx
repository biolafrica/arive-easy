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
    <div className="rounded-xl border border-border p-5">
      <h3 className="font-semibold text-heading mb-4">Pricing</h3>

      <dl className="space-y-2 text-sm">
        <Item label="Property Price" value={formatNaira(price)} />
        <Item label="Deposit Required" value={formatNaira(deposit)} />
        <Item label="Down Payment" value={formatNaira(down_payment)} />
        <Item label="Payment Period" value={`${payment_period} years`} />
        <Item label="Interest Rate" value={`${interest_rate}% p.a`} />
      </dl>
    </div>
  );
}

function Item({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between text-secondary">
      <span>{label}</span>
      <span className="font-medium text-heading">{value}</span>
    </div>
  );
}
