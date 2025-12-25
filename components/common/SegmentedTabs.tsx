'use client';

import { Button } from '../primitives/Button';

export interface SegmentedTab {
  id: string;
  label: string;
}

interface SegmentedTabsProps {
  tabs: SegmentedTab[];
  active: string;
  onChange: (id: string) => void;
}

export function SegmentedTabs({
  tabs,
  active,
  onChange,
}: SegmentedTabsProps) {
  return (
    <div className="inline-flex rounded-lg border border-border bg-card p-1">
      {tabs.map((tab) => (
        <Button
          size="sm"
          key={tab.id}
          onClick={() => onChange(tab.id)}
          variant={active === tab.id ? "filled" : "ghost"}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
