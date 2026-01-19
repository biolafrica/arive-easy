import { useState , useRef, useEffect } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { PropertyBase, PropertyStatus } from '@/type/pages/property';

type DisplayStatus = {
  tone: 'active' | 'inactive';
  label: string;
};

interface PropertyActionsProps {
  property: PropertyBase;
  onEdit: (property: PropertyBase) => void;
}

export function resolvePropertyStatus(status: PropertyStatus): DisplayStatus {
  const inactiveStatuses = ['draft', 'paused', 'withdrawn'] as const;
  
  if (inactiveStatuses.includes(status as any)) {
    return { tone: 'inactive', label: status.replace(/_/g, ' ')};
  }
  
  return { tone: 'active', label: status.replace(/_/g, ' ') };
}

export function StatusBadge({ tone, label }: DisplayStatus) {
  return (
    <span
      className={`rounded-md px-3 py-1 text-sm font-medium capitalize ${
        tone === 'active'
          ? 'bg-green-100 text-green-700'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {label}
    </span>
  );
}


export function PropertyActions({ property, onEdit }: PropertyActionsProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const handleEdit = () => {
    setOpen(false);
    onEdit(property); 
  };

  const handleView = () => {
    setOpen(false);
    router.push(`/seller-dashboard/listings/${property.id}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full p-2 hover:bg-muted transition-colors"
        aria-label="Property actions"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-40 rounded-lg border bg-white shadow-lg">
          <button
            onClick={handleEdit}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleView}
            className="block w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
          >
            View
          </button>
        </div>
      )}
    </div>
  );
}

