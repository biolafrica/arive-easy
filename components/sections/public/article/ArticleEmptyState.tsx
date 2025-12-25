import { FolderIcon } from '@heroicons/react/24/outline';
import { ArticleCategory } from '@/hooks/useArticleFilter';
import { EmptyState } from '@/components/feedbacks/Empty';

interface Props {
  category?: ArticleCategory;
  onReset?: () => void;
}

export function ArticleEmptyState({ category, onReset }: Props) {
  const labels: Record<string, string> = {
    all: 'articles',
    'market-trends': 'market trend articles',
    'financial-planning': 'financial planning articles',
    advice: 'advice articles',
  };

  const label = labels[category ?? 'all'] ?? 'articles';

  if (category && category !== 'all') {
    return (
      <EmptyState
        icon={<FolderIcon className="h-24 w-24" />}
        title={`No ${label} found`}
        description={`We don't have any ${label} right now.`}
        actions={[
          ...(onReset
            ? [
                {
                  label: 'View all articles',
                  onClick: onReset,
                },
              ]
            : []),
          {
            label: 'Go back',
            variant: 'ghost',
            onClick: () => window.history.back(),
          },
        ]}
      />
    );
  }

  return (
    <EmptyState
      icon={<FolderIcon className="h-24 w-24" />}
      title="No articles available"
      description="Check back soon for new content!"
    />
  );
}

