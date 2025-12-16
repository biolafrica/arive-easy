import { cn } from '@/lib/utils';
import { FAQCategory } from '@/type/faq';

interface Props {
  categories: FAQCategory[];
  active: string;
  counts: Record<string, number>;
  onChange: (id: string) => void;
}

export function FAQCategories({
  categories,
  active,
  counts,
  onChange,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-medium text-heading mb-3">
        Categories
      </h3>

      <ul className="space-y-1">
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => onChange(cat.id)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition',
                active === cat.id
                  ? 'bg-hover text-heading'
                  : 'text-secondary hover:bg-hover'
              )}
            >
              <span>{cat.label}</span>
              <span className="rounded-full bg-hover px-2 text-xs">
                {counts[cat.id] ?? 0}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
