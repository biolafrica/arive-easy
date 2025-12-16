import { CTASection } from "@/components/sections/public/CTASection";
import { FeaturedProperties } from "@/components/sections/public/property/FeaturedProperties";
import { ArticleSection } from "@/components/sections/public/HomeArticle";
import { HowItWorksSection } from "@/components/sections/public/HowItWorks";
import { TestimonialsSection } from "@/components/sections/public/Testimonial";
import { WhyChooseUs } from "@/components/sections/public/WhyChooseUs";

import { articles } from "@/data/articles";
import { FEATURED_PROPERTIES } from "@/data/property";
import { testimonials } from "@/data/testimonial";

export default function Home() {
  return (
    <div className="text-5xl">
      <FeaturedProperties properties={FEATURED_PROPERTIES}/>

      <HowItWorksSection/>

      <WhyChooseUs
        image="/why-arive.jpg"
        features={[
          'Trusted Property Listings',
          'Seamless Digital Process',
          'Flexible Mortgage Plans',
          'Low Interest Rates',
        ]}
      />

      <TestimonialsSection testimonials={testimonials} />

      <ArticleSection
        eyebrow="Featured Post"
        title="News and Articles"
        description="Stay informed with the latest trends, tips, and insights in global real estate."
        items={articles}
        ctaLabel="View all"
        ctaHref="/articles"
      />
      
      <CTASection/>
    </div>
  );
}

