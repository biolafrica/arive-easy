import { SectionHeading } from "@/components/common/SectionHeading";
import ArticleViewClient from "@/components/sections/public/article/ArticlesViewClient";

export default function ArticlePage(){
  return(
    <div className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5">
          <SectionHeading
            eyebrow='Articles'
            title='Homeownership Hub'
            description='Expert tips,tools, and Knowledge for every stage of your home buying journey'
          />
        </div>

        <ArticleViewClient/>
      </div>
    </div>
  )
}