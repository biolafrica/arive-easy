export interface ArticleAuthor {
  name: string;
  avatarUrl?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  author: ArticleAuthor;
  date: string;
  readTime?: string;
  href: string;
}
