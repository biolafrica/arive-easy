'use client';

import { SectionHeading } from '@/components/common/SectionHeading';
import { FAQ_CATEGORIES, FAQ_ITEMS } from '@/data/faq';
import { FAQCategories } from './FAQCategories';
import { Button } from '@/components/primitives/Button';
import { FAQItem } from './FAQItem';
import { useRouter } from 'next/navigation';
import { useFAQ } from '@/hooks/useFAQ';
import { FAQSectionProps } from '@/type/faq';
import { FAQTabs } from './FAQTab';


export function FAQSection({
  items = FAQ_ITEMS,
  categories = FAQ_CATEGORIES,
  variant = 'sidebar',
  title = 'Frequently Asked Questions',
  description = 'Find answers to common questions about Ariveasy.',
}: FAQSectionProps) {
  const router = useRouter();
  const { active, setActive, filtered, counts } = useFAQ(items);

  return (
    <section className="py-24 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <SectionHeading
          eyebrow="FAQs"
          title={title}
          description={description}
        />

        {variant === 'tabs' && (
          <div className="mt-8">
            <FAQTabs
              categories={categories}
              active={active}
              onChange={setActive}
            />

            <div className="mt-6">
              {filtered.map((faq) => (
                <FAQItem key={faq.id} item={faq} />
              ))}
            </div>
          </div>
        )}

        {variant === 'sidebar' && (
          <div className="mt-16 grid gap-12 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <FAQCategories
                categories={categories}
                active={active}
                counts={counts}
                onChange={setActive}
              />

              <div className="mt-10">
                <h4 className="font-medium text-heading">
                  Still have questions?
                </h4>
                <p className="mt-2 text-sm text-secondary">
                  Can&apos;t find what you&apos;re looking for? Our support team
                  is here to help.
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => router.push('/support')}
                >
                  Contact
                </Button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h3 className="text-xl font-semibold text-heading mb-2">
                {categories.find((c) => c.id === active)?.label}
              </h3>
              <p className="text-sm text-secondary mb-6">
                {filtered.length} Questions
              </p>

              {filtered.map((faq) => (
                <FAQItem key={faq.id} item={faq} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

