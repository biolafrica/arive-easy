'use client'
import { FAQItem } from "@/type/faq";
import { useMemo, useState } from "react";

export function useFAQ(items: FAQItem[]) {
  const [active, setActive] = useState('all');

  const filtered =
    active === 'all'
      ? items
      : items.filter((i) => i.category === active);

  const counts = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, {});
  }, [items]);

  return {
    active,
    setActive,
    filtered,
    counts,
  };
}
