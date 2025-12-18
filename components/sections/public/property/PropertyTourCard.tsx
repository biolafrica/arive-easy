import Image from 'next/image';
import { Button } from '@/components/primitives/Button';
import { CubeIcon, PlayIcon } from '@heroicons/react/24/outline';
import { PropertyTourCardProps } from '@/type/pages/property';


export function PropertyTourCard({
  images,
  tours
}: PropertyTourCardProps) {
  const Icon = tours?.virtual3D ? CubeIcon : PlayIcon;
  const title = tours?.virtual3D ? "3D Virtual Tour" : "Video Tour"
  const coverImage = images[0];
  const url = tours?.video ? tours.video.url : tours?.virtual3D?.url;
  const buttonLabel = tours?.virtual3D ? "Start Virtual Tour" : "Start Video"

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
