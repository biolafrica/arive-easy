import { ArticleData, ArticleTransformData } from "@/type/pages/article";

export function transformArticle(dbArticle: ArticleData): ArticleTransformData {
  const imagesObj = dbArticle.images && dbArticle.images.length > 0
  ? {
      image_1: dbArticle.images[0] || '',
      image_2: dbArticle.images[1] || '',
      image_3: dbArticle.images[2] || '',
    }
  : null;

  return {
    id: dbArticle.id,
    title: dbArticle.title,
    content: dbArticle.content,
    slug:dbArticle.slug,
    images: imagesObj,
    created_at: dbArticle.created_at,
    users:dbArticle.users,
    read_time:dbArticle.read_time

  };
}