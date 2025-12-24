import { cn } from "@/lib/utils";
import { FAQCategory } from "@/type/faq";

interface FAQTabsProps {
  categories: FAQCategory[];
  active: string;
  onChange: (id: string) => void;
}

export function FAQTabs({
  categories,
  active,
  onChange,
}: FAQTabsProps) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            'whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition',
            active === cat.id
              ? 'bg-orange-500 text-white'
              : 'border border-border text-secondary hover:bg-muted'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
