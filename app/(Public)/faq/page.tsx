import { createMetadata } from "@/components/common/metaData";
import { FAQSection } from "@/components/sections/public/faq/FAQSection";

export const metadata = createMetadata({
  title: "FAQ - Kletch",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/faq",
});

export default function FAQPage() {
  return <FAQSection variant="sidebar" />;
}

