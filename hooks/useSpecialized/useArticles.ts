import { ArticleBase } from "@/type/pages/article";
import { createEntityHooks } from "./useFactory";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import apiClient, { ApiResponse } from "@/lib/api-client";
import { getEntityCacheConfig } from '@/lib/cache-config';


const articleHooks = createEntityHooks<
  ArticleBase,
  'articles',
  'list',
  'detail'
>({
  resource: 'articles',
  cacheKey: 'articles',
  listSubKey: 'list',
  detailSubKey: 'detail'
})

export const useArticles = articleHooks.useList;
export const useArticle = articleHooks.useDetail;
export const useInfiniteArticles = articleHooks.useInfinite;

export function useRelatedArticles(
  currentArticle: ArticleBase | undefined,
  limit = 3
) {
  return useQuery({
    queryKey: queryKeys.articles.related(currentArticle?.id || '', limit),
    queryFn: async () => {
      if (!currentArticle) return [];
      
      const response = await apiClient.get<ApiResponse<ArticleBase[]>>('/api/articles', {
        category: currentArticle.category,
        'id.neq': currentArticle.id,  
        limit,
      });
      
      return response.data ;
    },
    enabled: !!currentArticle,
    ...getEntityCacheConfig('articles', 'list'),
  });
}