import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserAvatar } from '@/components/primitives/UserAvatar';
import { ArticleCardProps } from '@/type/pages/article';


export const ArticleCard: React.FC<ArticleCardProps> = (article) => {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/articles/${article.id}`}
        className="relative overflow-hidden rounded-xl bg-hover"
      >
        <Image
          src={article.image}
          alt={article.title}
          width={600}
          height={400}
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">
          {article.category}
        </span>

        <h3 className="text-lg font-semibold leading-snug text-heading group-hover:text-accent transition-colors">
          <Link  href={`/articles/${article.id}`}>{article.title}</Link>
        </h3>

        <p className="text-sm text-secondary line-clamp-2">
          {article.excerpt}
        </p>

        <div className="mt-3 flex items-center gap-3 text-sm text-secondary">
          <UserAvatar
            name={article.author.name}
            size="sm"
          />

          <div className="flex items-center gap-2">
            <span>{article.author.name}</span>
            <span>•</span>
            <span>{article.created_at}</span>
            {article.read_time && (
              <>
                <span>•</span>
                <span>{article.read_time} mins</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
