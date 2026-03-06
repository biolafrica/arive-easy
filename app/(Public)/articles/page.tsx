import { SectionHeading } from "@/components/common/SectionHeading";
import { createMetadata } from "@/components/common/metaData";
import ArticleViewClient from "@/components/sections/public/article/ArticlesViewClient";

export const metadata = createMetadata({
  title: "Homeownership Hub - Articles",
  description: "Find your perfect home in Nigeria...",
  url: "https://useKletch.com/articles",
});


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