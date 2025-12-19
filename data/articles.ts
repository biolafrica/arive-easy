import { ArticleCardProps } from "@/type/pages/article";

export const articles: ArticleCardProps[] = [
  {
    id: '1',
    title:'How to Save for a Down Payment Without Breaking Your Budget',
    excerpt:'Learn smart strategies to build your down payment while maintaining financial stability.',
    category: 'Home Ownership Tips',
    image: '/article-1.jpg',
    author: { name: 'Abiodun Biobaku' },
    created_at: '11 Jan 2022',
    read_time: 5,
  },
  {
    id: '2',
    title:'Top 10 Common Mistakes That First-Time Home Buyers Make and How to Avoid Them',
    excerpt:'Avoid costly errors and navigate the home buying process with confidence.',
    category: 'Financial Planning',
    image: '/article-2.jpg',
    author: { name: 'Olaleye Muhammed' },
    created_at: '11 Jan 2022',
    read_time: 5,
  },
  {
    id: '3',
    title:'Is Now the Right Time to Buy? Understanding Market Trends in 2025',
    excerpt:'A data-driven look at current housing market trends and what they mean for buyers.',
    category: 'Market Trends',
    image: '/article-3.jpg',
    author: { name: 'Folaji Jamiu' },
    created_at: '11 Jan 2022',
    read_time: 5,
  },
];