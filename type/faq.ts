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
