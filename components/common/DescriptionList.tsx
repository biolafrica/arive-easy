import { PaperClipIcon, ArrowDownTrayIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export type DescriptionValue = | { type: 'text'; value: string } | { type: 'paragraph'; value: string }
  | { type: 'attachments'; files: { name: string; size?: string; url?: string }[];}
  | { type: 'custom'; node: React.ReactNode };

export interface DescriptionItem { label: string; value: DescriptionValue;}

interface DescriptionListProps { title?: string; subtitle?: string; items: DescriptionItem[];}

export function DescriptionList({ title, subtitle, items }: DescriptionListProps) {
  return (
    <section className="space-y-6">
      {(title || subtitle) && (
        <div>
          {title && (<h3 className="text-lg font-semibold text-heading"> {title} </h3>)}
          {subtitle && (<p className="text-sm text-secondary mt-1"> {subtitle} </p>)}
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
      <dt className="text-sm font-medium text-heading"> {item.label} </dt>

      <dd className="text-sm text-secondary sm:col-span-2">
        <DescriptionValueRenderer value={item.value} />
      </dd>
    </div>
  );
}

function DescriptionValueRenderer({ value}: {value: DescriptionValue}) {
  const handleView = (url: string, fileName: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
    
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error('Download failed:', error);
    }
  };

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
              className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-gray-50 transition-colors"
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
              
              {file.url && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleView(file.url!, file.name)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View in new tab"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownload(file.url!, file.name)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download file"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </button>
                </div>
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

