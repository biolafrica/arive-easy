import { CTASection } from "@/components/sections/public/CTASection";
import { FeaturedProperties } from "@/components/sections/public/property/FeaturedProperties";
import { ArticleSection } from "@/components/sections/public/article/HomeArticle";
import { HowItWorksSection } from "@/components/sections/public/HowItWorks";
import { TestimonialsSection } from "@/components/sections/public/Testimonial";
import { WhyChooseUs } from "@/components/sections/public/WhyChooseUs";
import { testimonials } from "@/data/testimonial";

export default function Home() {
  return (
    <div className="text-5xl">
      <FeaturedProperties/>

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

      <ArticleSection/>
      
      <CTASection/>
    </div>
  );
}

