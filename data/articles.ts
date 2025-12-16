import { ArticleItem } from "@/type/article";

export const articles: ArticleItem[] = [
  {
    id: '1',
    title: 'How to Save for a Down Payment Without Breaking Your Budget',
    description:
      'Learn smart strategies to build your down payment while maintaining financial stability.',
    category: 'Home Ownership Tips',
    image: '/article-1.jpg',
    author: { name: 'Abiodun Biobaku' },
    date: '11 Jan 2022',
    readTime: '5 min read',
    href: '/articles/save-for-down-payment',
  },
  {
    id: '2',
    title:
      'Top 10 Common Mistakes That First-Time Home Buyers Make and How to Avoid Them',
    description:
      'Avoid costly errors and navigate the home buying process with confidence.',
    category: 'Financial Planning',
    image: '/article-2.jpg',
    author: { name: 'Olaleye Muhammed' },
    date: '11 Jan 2022',
    readTime: '5 min read',
    href: '/articles/common-mistakes',
  },
  {
    id: '3',
    title:
      'Is Now the Right Time to Buy? Understanding Market Trends in 2025',
    description:
      'A data-driven look at current housing market trends and what they mean for buyers.',
    category: 'Market Trends',
    image: '/article-3.jpg',
    author: { name: 'Folaji Jamiu' },
    date: '11 Jan 2022',
    readTime: '5 min read',
    href: '/articles/market-trends-2025',
  },
];