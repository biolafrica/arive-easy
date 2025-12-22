'use client';

import { ArticleCategory, ARTICLE_CATEGORIES } from '@/hooks/useArticleFilter';

interface ArticleCategoryFilterProps {
  selected: ArticleCategory;
  onChange: (category: ArticleCategory) => void;
  className?: string;
}

export function ArticleCategoryFilter({ 
  selected, 
  onChange,
  className = ''
}: ArticleCategoryFilterProps) {
  return (
    <div className={`inline-flex rounded-lg border border-gray-200 bg-white p-1 ${className}`}>
      {ARTICLE_CATEGORIES.map((category) => (
        <button
          key={category.value}
          onClick={() => onChange(category.value as ArticleCategory)}
          className={`
            relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md
            ${selected === category.value
              ? 'bg-primary text-orange-600 shadow-sm'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}