import Image from 'next/image';
import { Button } from '@/components/primitives/Button';
import { CubeIcon, PlayIcon } from '@heroicons/react/24/outline';

interface PropertyTourCardProps {
  title: string;
  coverImage: string;
  buttonLabel: string;
  url: string;
  type: '3d' | 'video';
}

export function PropertyTourCard({
  title,
  coverImage,
  buttonLabel,
  url,
  type,
}: PropertyTourCardProps) {
  const Icon = type === '3d' ? CubeIcon : PlayIcon;

  return (
    <div className="rounded-xl border border-border p-4 space-y-4">
      <h3 className="text-lg font-semibold text-heading">
        {title}
      </h3>

      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-black/50">
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        fullWidth
        onClick={() => window.open(url, '_blank')}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
