import { ArticleForm } from "@/type/pages/article";
import { createCRUDHandlers } from "@/utils/server/crudFactory";


const articlesHandlers = createCRUDHandlers<ArticleForm>({
  table: 'articles',
  requiredFields: ['title', 'description', 'category', 'image', 'images', 'read_time', 'excerpt'],
  searchFields: ['title'],
  defaultSort: {
    field: 'created_at',
    order: 'desc'
  }
});

export const {GET} = articlesHandlers;