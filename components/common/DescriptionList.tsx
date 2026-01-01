export type DescriptionValue = | { type: 'text'; value: string } | { type: 'paragraph'; value: string }
| { type: 'attachments';
    files: {
      name: string;
      size?: string;
      onDownload?: () => void;
    }[];
  }
| { type: 'custom'; node: React.ReactNode };

export interface DescriptionItem {
  label: string;
  value: DescriptionValue;
}

import { PaperClipIcon } from '@heroicons/react/24/outline';

interface DescriptionListProps {
  title?: string;
  subtitle?: string;
  items: DescriptionItem[];
}

export function DescriptionList({
  title,
  subtitle,
  items,
}: DescriptionListProps) {
  return (
    <section className="space-y-6">
      {(title || subtitle) && (
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-heading">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-secondary mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="divide-y rounded-lg border bg-white">
        {items.map((item, idx) => (
          <DescriptionRow key={idx} item={item} />
        ))}
      </div>
    </section>
  );

}

function DescriptionRow({ item }: { item: DescriptionItem }) {
  return (
    <div className="grid gap-2 px-4 py-5 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-heading">
        {item.label}
      </dt>

      <dd className="text-sm text-secondary sm:col-span-2">
        <DescriptionValueRenderer value={item.value} />
      </dd>
    </div>
  );
}

function DescriptionValueRenderer({
  value,
}: {
  value: DescriptionValue;
}) {
  switch (value.type) {
    case 'text':
      return <span>{value.value}</span>;

    case 'paragraph':
      return (
        <p className="leading-relaxed whitespace-pre-line">
          {value.value}
        </p>
      );

    case 'attachments':
      return (
        <div className="space-y-3">
          {value.files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <PaperClipIcon className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium text-heading">
                    {file.name}
                  </p>
                  {file.size && (
                    <p className="text-xs text-secondary">
                      {file.size}
                    </p>
                  )}
                </div>
              </div>

              {file.onDownload && (
                <button
                  onClick={file.onDownload}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Download
                </button>
              )}
            </div>
          ))}
        </div>
      );

    case 'custom':
      return <>{value.node}</>;

    default:
      return null;
  }
}

