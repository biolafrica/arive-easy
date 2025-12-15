import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleItem } from '@/type/article';

interface ArticleCardProps {
  item: ArticleItem;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ item }) => {
  return (
    <article className="group flex flex-col">
      <Link
        href={item.href}
        className="relative overflow-hidden rounded-xl bg-hover"
      >
        <Image
          src={item.image}
          alt={item.title}
          width={600}
          height={400}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">
          {item.category}
        </span>

        <h3 className="text-lg font-semibold leading-snug text-heading group-hover:text-accent transition-colors">
          <Link href={item.href}>{item.title}</Link>
        </h3>

        <p className="text-sm text-secondary line-clamp-2">
          {item.description}
        </p>

        <div className="mt-3 flex items-center gap-3 text-sm text-secondary">
          <div className="h-8 w-8 rounded-full bg-hover flex items-center justify-center text-xs font-medium">
            {item.author.name.charAt(0)}
          </div>

          <div className="flex items-center gap-2">
            <span>{item.author.name}</span>
            <span>•</span>
            <span>{item.date}</span>
            {item.readTime && (
              <>
                <span>•</span>
                <span>{item.readTime}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
