export interface FAQCategory {
  id: string;
  label: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export type FAQVariant = 'sidebar' | 'tabs';

export interface FAQSectionProps {
  items?: FAQItem[];
  categories?: FAQCategory[];
  variant?: 'sidebar' | 'tabs';
  title?: string;
  description?: string;
}
