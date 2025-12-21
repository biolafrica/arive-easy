export interface ArticleAuthor {
  name: string;
  email: string;
}

export interface ArticleBase{
  id: string;
  title: string;
  excerpt:string;
  content: string;
  category: string;
  image:string;
  images:string[]
  author: string;
  users:ArticleAuthor
  created_at: string
  updated_at: string
  read_time : number
  slug: string
}

export type ArticleForm = Omit<ArticleBase, 'id' | 'created_at' | 'updated_at' | 'author' | 'slug'>
export type ArticleCardProps = Omit<ArticleBase, 'content' | 'images' | 'updated_at'>


export interface ArticleSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: ArticleCardProps[];
  ctaLabel?: string;
}