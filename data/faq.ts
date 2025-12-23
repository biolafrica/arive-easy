import { FAQCategory, FAQItem } from "@/type/faq";

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'all', label: 'All Questions' },
  { id: 'general', label: 'Getting Started' },
  { id: 'buying', label: 'Buying Property' },
  { id: 'financing', label: 'Mortgages & Lenders' },
  { id: 'legal', label: 'Legal & Compliance' },
  { id: 'technical', label: 'Security & Data' },
];

export const FAQ_ITEMS: FAQItem[] = [
  /* -------------------- GETTING STARTED -------------------- */
  {
    id: 'faq-general-1',
    category: 'general',
    question: 'What is Ariveasy?',
    answer:
      'Ariveasy is a digital platform that connects buyers, sellers, and lenders to make cross-border property buying safer and more transparent for the diasporan community. We provide verified properties, virtual tours, document verification, secure e-signatures, and structured communication between all parties.',
  },
  {
    id: 'faq-general-2',
    category: 'general',
    question: 'Is Ariveasy a bank, lender, or real estate agent?',
    answer:
      'No. Ariveasy is not a bank, lender, law firm, or real estate agency. We are a technology platform that helps buyers work with trusted sellers and licensed lenders.',
  },

  /* -------------------- BUYING PROPERTY -------------------- */
  {
    id: 'faq-buying-1',
    category: 'buying',
    question: 'Can I use Ariveasy if I live abroad?',
    answer:
      'Yes. Ariveasy is built for diasporans. You can search verified properties, take 3D virtual tours, book video walkthroughs, upload documents, sign agreements, and monitor your progress entirely from abroad.',
  },
  {
    id: 'faq-buying-2',
    category: 'buying',
    question: 'Can I buy a property that is not listed on Ariveasy?',
    answer:
      'Yes. You can bring your own property found through an agent, friend, or private source. However, it must pass Ariveasy’s verification process before any lender or partner can proceed.',
  },
  {
    id: 'faq-buying-3',
    category: 'buying',
    question: 'What is the typical journey for a buyer?',
    answer:
      'Create an account, complete your profile, get pre-approved for a mortgage, upload documents for verification, select or submit a property, complete verification, receive a lender decision, make the required down payment, sign agreements electronically, and set up mortgage payments.',
  },

  /* -------------------- PROPERTY VERIFICATION -------------------- */
  {
    id: 'faq-buying-4',
    category: 'buying',
    question: 'How does Ariveasy verify a property?',
    answer:
      'We work only with verified sellers and reputable partners. Properties are checked for seller identity, ownership documents, relevant property records, and supporting documentation. Only verified properties proceed.',
  },
  {
    id: 'faq-buying-5',
    category: 'buying',
    question: 'Why do you verify every property, even if I bring it myself?',
    answer:
      'Verification protects buyers and lenders from fake listings, double-selling, and ownership disputes. It is a core part of how Ariveasy reduces fraud risk.',
  },

  /* -------------------- MORTGAGES & LENDERS -------------------- */
  {
    id: 'faq-financing-1',
    category: 'financing',
    question: 'Does Ariveasy provide mortgages?',
    answer:
      'No. Mortgage and financing decisions are made by licensed partner lenders. Ariveasy securely organizes and transmits information to support the process.',
  },
  {
    id: 'faq-financing-2',
    category: 'financing',
    question: 'Does Ariveasy guarantee mortgage approval?',
    answer:
      'No. All lending decisions, rates, and approvals are made independently by lenders. Ariveasy does not guarantee approval.',
  },
  {
    id: 'faq-financing-3',
    category: 'financing',
    question: 'How do lenders use Ariveasy?',
    answer:
      'Lenders receive applications and documents, request additional information, issue pre-approvals or decisions, and electronically sign agreements through the platform.',
  },

  /* -------------------- SELLERS -------------------- */
  {
    id: 'faq-buying-6',
    category: 'buying',
    question: 'Who can list a property on Ariveasy?',
    answer:
      'Verified individual property owners, developers, and real estate companies can list properties after passing identity and documentation checks.',
  },
  {
    id: 'faq-buying-7',
    category: 'buying',
    question: 'Do sellers pay any fees?',
    answer:
      'Sellers are not charged platform fees. Ariveasy may earn referral commissions from sellers, lenders, or both.',
  },

  /* -------------------- BROKERS & REFERRALS -------------------- */
  {
    id: 'faq-general-3',
    category: 'general',
    question: 'Can brokers work with Ariveasy?',
    answer:
      'Yes. Brokers can refer qualified buyers to Ariveasy and earn commissions through referral or partner programs, subject to agreement terms.',
  },

  /* -------------------- PAYMENTS & FEES -------------------- */
  {
    id: 'faq-financing-4',
    category: 'financing',
    question: 'Does Ariveasy handle my money directly?',
    answer:
      'No. Ariveasy never holds customer funds. All payments, deposits, and mortgage remittances are handled by licensed third-party providers.',
  },
  {
    id: 'faq-financing-5',
    category: 'financing',
    question: 'What fees does Ariveasy charge?',
    answer:
      'We charge a flat processing fee for document verification. There are no subscriptions or general platform access fees.',
  },
  {
    id: 'faq-financing-6',
    category: 'financing',
    question: 'Are processing fees refundable?',
    answer:
      'Processing fees are non-refundable because verification work begins immediately after payment, unless explicitly stated otherwise.',
  },

  /* -------------------- SECURITY & DATA -------------------- */
  {
    id: 'faq-technical-1',
    category: 'technical',
    question: 'What information does Ariveasy collect?',
    answer:
      'We collect basic account details, profile information, employment and income data, property preferences, and documents required for verification.',
  },
  {
    id: 'faq-technical-2',
    category: 'technical',
    question: 'How is my information protected?',
    answer:
      'We use encrypted storage, secure connections, strict access controls, and reputable third-party verification and payment processors. We comply with PIPEDA and NDPA.',
  },
  {
    id: 'faq-technical-3',
    category: 'technical',
    question: 'Do you sell my data?',
    answer:
      'No. Ariveasy does not sell personal data under any circumstances.',
  },
  {
    id: 'faq-technical-4',
    category: 'technical',
    question: 'Does Ariveasy store my bank or card details?',
    answer:
      'No. All bank and card information is handled by licensed third-party processors and never stored by Ariveasy.',
  },

  /* -------------------- LEGAL & COMPLIANCE -------------------- */
  {
    id: 'faq-legal-1',
    category: 'legal',
    question: 'Is Ariveasy providing legal, tax, or investment advice?',
    answer:
      'No. Ariveasy does not provide legal, tax, or investment advice. Users should consult qualified professionals before making decisions.',
  },
  {
    id: 'faq-legal-2',
    category: 'legal',
    question: 'Does Ariveasy guarantee property appreciation?',
    answer:
      'No. Property values can rise or fall. Ariveasy does not guarantee future performance, rental income, or appreciation.',
  },
  {
    id: 'faq-legal-3',
    category: 'legal',
    question: 'Who is responsible if there is a dispute?',
    answer:
      'Property disputes are handled between buyers and sellers, while financing disputes are handled between buyers and lenders. Ariveasy provides transparency, documentation, and traceability but is not a legal arbitrator.',
  },

  /* -------------------- ACCOUNT & SUPPORT -------------------- */
  {
    id: 'faq-general-4',
    category: 'general',
    question: 'Who can use Ariveasy?',
    answer:
      'You must be at least 18 years old, legally able to enter binding contracts, and provide accurate information.',
  },
  {
    id: 'faq-general-5',
    category: 'general',
    question: 'Can I delete my account?',
    answer:
      'Yes. You may request account deletion. Some information may be retained temporarily to comply with legal or fraud-prevention requirements.',
  },
  {
    id: 'faq-general-6',
    category: 'general',
    question: 'How do I contact support?',
    answer:
      'You can contact us by submitting a support ticket on the platform or emailing support@ariveasy.com.',
  },
];
