'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCrud } from '@/hooks/useCrud';
import { Property, PropertyCreatePayload, PropertyForm } from './property-form';

export interface Props{
  close: ()=>void
}
export default function SellerPropertyNew({close}:Props) {
  const router = useRouter();
  
  const { create, isCreating } = useCrud<Property>({
    resource: 'properties',
    interfaceType: 'buyer',
    showNotifications: false,
  });

  const handleSubmit = async (payload: PropertyCreatePayload) => {
    try {
      const newProperty = await create(payload);
      toast.success('Property created successfully!');
      setTimeout(()=>{ close()}, 1500)
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <PropertyForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Create Property"
      />
    </div>
  );
}