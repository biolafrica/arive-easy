import { Button } from "@/components/primitives/Button";
import { ArticleCategory } from "@/hooks/useArticleFilter";

interface ArticleEmptyStateProps {
  category?: ArticleCategory;
  onReset?: () => void;
}

export function ArticleEmptyState({ category, onReset }: ArticleEmptyStateProps) {
  const getCategoryLabel = () => {
    const labels: Record<string, string> = {
      'all': 'articles',
      'market-trend': 'market trend articles',
      'financial-planning': 'financial planning articles',
      'advice': 'advice articles'
    };
    return labels[category || 'all'] || 'articles';
  };

  if (category && category !== 'all') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <svg
          className="w-24 h-24 text-gray-300 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No {getCategoryLabel()} found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md">
          We don't have any {getCategoryLabel()} at the moment. 
          Try checking out all articles or come back later.
        </p>
        <div className="flex gap-3">
          {onReset && (
            <Button variant="outline" onClick={onReset}>
              View all articles
            </Button>
          )}
          <Button variant="ghost" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <svg
        className="w-24 h-24 text-gray-300 mb-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No articles available
      </h3>
      <p className="text-gray-600">
        Check back soon for new content!
      </p>
    </div>
  );
}