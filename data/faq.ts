import { FAQCategory, FAQItem } from "@/type/faq";

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: "all", label: "All Questions" },
  { id: "about", label: "About Kletch" },
  { id: "buying", label: "Buying Property" },
  { id: "security", label: "Security & Verification" },
  { id: "fees", label: "Fees" },
  { id: "legal", label: "Legal & Closing" },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-about-1",
    category: "about",
    question: "What is Kletch?",
    answer:
      "Kletch is a platform that helps diaspora buyers purchase verified properties abroad. It connects buyers, sellers, lenders, and legal professionals to coordinate property documentation, financing applications, and the closing process.",
  },
  {
    id: "faq-about-2",
    category: "about",
    question: "Does Kletch sell properties?",
    answer:
      "No. Kletch does not own or sell properties. Sellers list their properties on the platform, and Kletch helps coordinate verification, documentation, and the transaction process.",
  },
  {
    id: "faq-about-3",
    category: "about",
    question: "Who can use Kletch?",
    answer:
      "Kletch is designed for diaspora buyers looking to purchase property abroad, property sellers and developers, lenders offering mortgage financing, and legal professionals involved in property transactions.",
  },
  {
    id: "faq-about-4",
    category: "about",
    question: "Which countries does Kletch support?",
    answer:
      "Kletch currently focuses on property purchases in Nigeria. Additional markets may be supported in the future.",
  },

  {
    id: "faq-buying-1",
    category: "buying",
    question: "How does buying property through Kletch work?",
    answer:
      "The process typically involves creating an account, verifying identity, reviewing available properties, submitting interest or an application, uploading required documents, lender review if financing is needed, preparation of legal documentation, and coordinating closing with the seller and legal counsel.",
  },
  {
    id: "faq-buying-2",
    category: "buying",
    question: "Do I need to travel to Nigeria to buy property?",
    answer:
      "Not necessarily. Many parts of the transaction process, including identity verification, document submission, and signing agreements, can be completed remotely.",
  },
  {
    id: "faq-buying-3",
    category: "buying",
    question: "Are properties verified before they are listed?",
    answer:
      "Kletch verifies seller identity and business registration during onboarding. Additional property documentation and verification steps are completed during the transaction process before closing.",
  },
  {
    id: "faq-buying-4",
    category: "buying",
    question: "Can I apply for financing through Kletch?",
    answer:
      "Yes. Kletch can route borrower applications to partner lenders who offer mortgage or financing options for eligible buyers.",
  },

  {
    id: "faq-security-1",
    category: "security",
    question: "How does Kletch verify sellers?",
    answer:
      "Sellers must complete identity verification and, if applicable, business registration verification. Additional documentation related to the property and transaction is reviewed before closing.",
  },
  {
    id: "faq-security-2",
    category: "security",
    question: "Does Kletch hold buyer funds?",
    answer:
      "No. Kletch does not custody funds. Buyers make payments directly to sellers or lenders according to the payment instructions provided during the transaction process.",
  },
  {
    id: "faq-security-3",
    category: "security",
    question: "How does Kletch help prevent fraud?",
    answer:
      "Kletch verifies the identity of platform participants, reviews documentation during the transaction process, and coordinates with legal professionals to support a structured closing process.",
  },

  {
    id: "faq-fees-1",
    category: "fees",
    question: "Does Kletch charge buyers a platform fee?",
    answer:
      "Kletch does not charge a platform usage fee. A document verification fee may apply during the transaction process.",
  },
  {
    id: "faq-fees-2",
    category: "fees",
    question: "When do I pay the document verification fee?",
    answer:
      "The document verification fee is typically charged during the transaction process when required documents are being reviewed.",
  },

  {
    id: "faq-legal-1",
    category: "legal",
    question: "Who prepares the legal documents for the transaction?",
    answer:
      "Kletch coordinates with legal counsel in the country where the property is located to prepare and review transaction documents.",
  },
  {
    id: "faq-legal-2",
    category: "legal",
    question: "How are agreements signed?",
    answer:
      "Documents can be signed electronically using the platform’s secure e-signature system.",
  },
];
