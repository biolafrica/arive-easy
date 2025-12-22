'use client';

import { useState } from 'react';

export type ArticleCategory = 'all' | 'market-trend' | 'financial-planning' | 'advice';

export interface ArticleFilterState {
  category: ArticleCategory;
}

export const ARTICLE_CATEGORIES = [
  { value: 'all', label: 'All Articles' },
  { value: 'market-trends', label: 'Market Trends' },
  { value: 'financial-planning', label: 'Financial Planning' },
  { value: 'advice', label: 'Advice' },
] as const;

export function useArticleFilter() {
  const [category, setCategory] = useState<ArticleCategory>('all');

  const getProcessedFilters = () => {
    if (category === 'all') {
      return {};
    }
    
    const categoryMap: Record<string, string> = {
      'market-trend': 'Market Trends',
      'financial-planning': 'Financial Planning',
      'advice': 'Home Advice',
    };

    return {
      category: categoryMap[category] || category,
    };
  };

  return {
    category,
    setCategory,
    filters: getProcessedFilters(),
    categories: ARTICLE_CATEGORIES,
  };
}