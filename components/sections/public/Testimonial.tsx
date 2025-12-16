import { TestimonialCard } from '@/components/cards/public/testimonial';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Testimonial } from '@/type/testimonial';
import React from 'react';


interface Props {
  title?: string;
  description?: string;
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<Props> = ({
  title = 'What Our Users Are Saying',
  description = 'Real experiences from people who trusted Arive.',
  testimonials,
}) => {
  return (
    <section className="py-48 bg-layout">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading
        title={title}
        description={description}
        align="left"
        size="sm"
      />


        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
};
