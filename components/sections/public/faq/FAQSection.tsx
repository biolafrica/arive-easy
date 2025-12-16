'use client';

import { useMemo, useState } from 'react';
import { SectionHeading } from '@/components/common/SectionHeading';
import { FAQ_CATEGORIES, FAQ_ITEMS } from '@/data/faq';
import { FAQCategories } from './FAQCategories';
import { Button } from '@/components/primitives/Button';
import { FAQItem } from './FAQItem';



export function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('general');

  const filteredFAQs = useMemo(() => {
    if (activeCategory === 'all') return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (faq) => faq.category === activeCategory
    );
  }, [activeCategory]);

  const counts = useMemo(() => {
    return FAQ_ITEMS.reduce<Record<string, number>>((acc, faq) => {
      acc.all = (acc.all || 0) + 1;
      acc[faq.category] = (acc[faq.category] || 0) + 1;
      return acc;
    }, {});
  }, []);

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQs"
          title="Frequently Asked Questions"
          description="Find answers to common questions about buying property through Ariveasy."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <FAQCategories
              categories={FAQ_CATEGORIES}
              active={activeCategory}
              counts={counts}
              onChange={setActiveCategory}
            />

            <div className="mt-10">
              <h4 className="font-medium text-heading">
                Still have questions?
              </h4>
              <p className="mt-2 text-sm text-secondary">
                Can&apos;t find what you&apos;re looking for?
                Our support team is here to help.
              </p>
              <Button className="mt-4" variant="outline">
                Contact
              </Button>
            </div>
          </div>


          <div className="lg:col-span-3">
            <h3 className="text-xl font-semibold text-heading mb-2">
              {FAQ_CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h3>
            <p className="text-sm text-secondary mb-6">
              {filteredFAQs.length} Questions
            </p>

            <div>
              {filteredFAQs.map((faq) => (
                <FAQItem key={faq.id} item={faq} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
