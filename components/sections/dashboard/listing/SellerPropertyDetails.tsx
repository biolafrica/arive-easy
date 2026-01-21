import { useRouter,} from 'next/navigation';
import { toast } from 'sonner';
import { useCrud } from '@/hooks/useCrud';
import { Property, PropertyCreatePayload, PropertyForm } from "./property-form";

interface Props {
  property: Property;
  close:()=>void
}


export default function SellerPropertyDetails({ property, close }: Props) {
  const router = useRouter();

  const { update, isUpdating } = useCrud<Property>({
    resource: 'properties',
    interfaceType: 'buyer',
    showNotifications: false,
  });

  const handleSubmit = async (payload: PropertyCreatePayload) => {
    try {
      await update(property.id, payload);
      toast.success('Property updated successfully!');
      setTimeout(()=>{ close()}, 1500)
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!property) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg">
          <p className="font-medium">Error loading property</p>
          <p className="text-sm mt-1">
            {'Property not found'}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-sm underline hover:no-underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <PropertyForm
        property={property}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Update Property"
      />
    </div>
  );
}