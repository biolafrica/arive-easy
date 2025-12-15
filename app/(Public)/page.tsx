import { CTASection } from "@/components/sections/public/CTASection";
import { ArticleSection } from "@/components/sections/public/HomeArticle";
import { articles } from "@/data/articles";

export default function Home() {
  return (
    <div className="text-5xl">
      welcome Home
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
