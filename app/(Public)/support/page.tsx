import { SectionHeading } from "@/components/common/SectionHeading";
import { ContactForm } from "@/components/sections/public/contact/ContactForm";
import { ContactInfo } from "@/components/sections/public/contact/ContactInfo";

export default function ContactSection() {
  return (
    <section className="py-10 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Find Support"
          title="How can we help you?"
          description="Find answers to your questions about Ariveasy, properties, and mortgage applications."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
