interface PropertyPricingProps {
  price: string;
  deposit: string;
  downPayment: string;
  period: string;
  interest: string;
}

export function PropertyPricing({
  price,
  deposit,
  downPayment,
  period,
  interest,
}: PropertyPricingProps) {
  return (
    <div className="rounded-xl border border-border p-5">
      <h3 className="font-semibold text-heading mb-4">Pricing</h3>

      <dl className="space-y-2 text-sm">
        <Item label="Property Price" value={price} />
        <Item label="Deposit Required" value={deposit} />
        <Item label="Down Payment" value={downPayment} />
        <Item label="Payment Period" value={period} />
        <Item label="Interest Rate" value={interest} />
      </dl>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-secondary">
      <span>{label}</span>
      <span className="font-medium text-heading">{value}</span>
    </div>
  );
}
