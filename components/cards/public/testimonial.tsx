import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { Testimonial } from '@/type/testimonial';
import { UserAvatar } from '@/components/primitives/UserAvatar';

interface Props {
  testimonial: Testimonial;
}

export const TestimonialCard: React.FC<Props> = ({ testimonial }) => {
  return (
    <article className="flex flex-col justify-between ">
      <div className="flex gap-1 text-yellow-500">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <StarIcon key={i} className="h-5 w-5" />
        ))}
      </div>

      <blockquote className="mt-4 text-sm text-text leading-relaxed">
        “{testimonial.quote}”
      </blockquote>

      <div className="mt-5 flex-col items-center gap-5">
        
        <UserAvatar
          src={testimonial.src}
          name={testimonial.author.name}
          size="lg"
        />

        <div>
          <p className="text-sm font-medium text-heading">
            {testimonial.author.name}
          </p>
          <p className="text-xs text-secondary">
            {testimonial.author.role}
            {testimonial.author.company && `, ${testimonial.author.company}`}
          </p>
        </div>

      </div>
    </article>
  );
};
