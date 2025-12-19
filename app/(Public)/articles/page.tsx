import { ArticleSection } from "@/components/sections/public/HomeArticle";
import { articles } from "@/data/articles";

export default function ArticlePage(){
  return(
    <div>
      <ArticleSection
        eyebrow="Articles"
        title="Homeownership Hub"
        description="Expert tips, tools, and knowledge for every stage of your homebuying journey."
        items={articles}
        ctaLabel="View more"
      />
    </div>
  )
}