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
export type ArticleData = Omit<ArticleBase, 'category' | 'author' | 'updated_at' | 'image'> 
export type ArticleTransformData = Omit<ArticleBase, | 'category' | 'author' | 'updated_at' | 'images' | 'image'> &{
  images: {
    image_1: string | "";
    image_2: string | "";
    image_3: string | "";
  } | null;
}


export interface ArticleSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: ArticleCardProps[];
  ctaLabel?: string;
}