'use client';

import { Button } from '@/components/primitives/Button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { insertImagesIntoSections, parseContent, renderSection } from '@/utils/articleModification';
import { ArticleTransformData } from '@/type/pages/article';
import { formatDate } from '@/lib/formatter';
import SharePost from '@/components/common/Share';

export default function ArticleView({ article }: { 
  article:ArticleTransformData
}) {
 
  const imageArray = article.images 
  ? Object.values(article.images).filter(img => img && img.trim() !== '')
  : [];
  const sections = parseContent(article.content || '');
  const contentWithImages = insertImagesIntoSections(sections, imageArray);

  return (
    <article className="mx-auto max-w-4xl px-4 pb-20 pt-10">

      {/* Breadcrumb */}
      <Button
        variant="text"
        size="sm"
        leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
        className="w-fit px-0 text-secondary"
        onClick={() => window.history.back()}
      >
        Back to articles
      </Button>

      {/* Header */}
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-semibold text-heading sm:text-4xl">
         {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-secondary">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <span>{article?.users?.name}</span>
            <span>•</span>
            <span>{formatDate(article.created_at)}</span>
            <span>•</span>
            <span>{article.read_time}</span>
          </div>

          <SharePost article={article} />

        </div>
      </header>

      <div className="prose prose-lg max-w-none 
        prose-headings:text-heading 
        prose-p:text-text 
        prose-a:text-accent hover:prose-a:text-accent-hover
        prose-strong:text-heading
        prose-blockquote:text-secondary
        prose-code:text-text
        prose-pre:bg-hover
        dark:prose-invert
      ">
        {contentWithImages.map((section, index) => renderSection(section, index))}
      </div>

        <footer className="mt-12 pt-8 border-t border-separator">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <SharePost article={article} />

            <div className="mt-10 flex flex-wrap gap-2">
              {['Home Ownership Tips', 'Financial Planning', 'Finance', 'Money'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border px-3 py-1 text-xs text-secondary"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
        
          </div>
        </footer>

     
    

    </article>
  );
}
