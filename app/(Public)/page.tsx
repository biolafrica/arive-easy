import { CTASection } from "@/components/sections/public/home/CTASection";
import { FeaturedProperties } from "@/components/sections/public/property/FeaturedProperties";
import { ArticleSection } from "@/components/sections/public/article/HomeArticle";
import { HowItWorksSection } from "@/components/sections/public/home/HowItWorks";
import { TestimonialsSection } from "@/components/sections/public/home/Testimonial";
import { WhyChooseUs } from "@/components/sections/public/home/WhyChooseUs";
import { testimonials } from "@/data/testimonial";
import HeroSection from "@/components/sections/public/home/HeroSection";
import { HomePropertySearchWrapper } from "@/components/propertySearch/PropertySearchWraper";

export default function Home() {
  return (
    <main>

      <HeroSection backgroundImage="/images/hero.jpg">
        <HomePropertySearchWrapper />
      </HeroSection>

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

    </main>
  )
}