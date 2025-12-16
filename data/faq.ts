import { FAQCategory, FAQItem } from "@/type/faq";


export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'General' },
  { id: 'buying', label: 'Buying Process' },
  { id: 'financing', label: 'Financing' },
  { id: 'legal', label: 'Legal' },
  { id: 'technical', label: 'Technical' },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: 'What is Ariveasy and how does it work?',
    answer:
      'Ariveasy is a comprehensive real estate platform that connects homebuyers, property developers, and lenders. We simplify the property buying process by providing verified listings, flexible financing options, and secure transaction processing.',
  },
  {
    id: 'faq-2',
    category: 'general',
    question: 'Who can use Ariveasy?',
    answer:
      'Ariveasy is open to anyone looking to buy, sell, or finance real estate in Nigeria. We particularly cater to diaspora communities, immigrants, and international investors.',
  },
  {
    id: 'faq-3',
    category: 'general',
    question: 'Are all properties on Ariveasy verified?',
    answer:
      'Yes, all properties undergo thorough verification including title checks, legal due diligence, and developer credential reviews.',
  },
  {
    id: 'faq-4',
    category: 'financing',
    question: 'Can I get a mortgage if I live outside Nigeria?',
    answer:
      'Yes. We work with lenders who specialize in diaspora mortgage products and understand overseas income verification.',
  },
  {
    id: 'faq-5',
    category: 'technical',
    question: 'Can I track my application status online?',
    answer:
      'Yes. Your dashboard provides real-time updates on application stages, required documents, and next steps.',
  },
];
