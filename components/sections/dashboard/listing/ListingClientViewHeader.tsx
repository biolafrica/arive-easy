import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useDeleteProperty } from "@/hooks/useSpecialized";
import { ArchiveBoxIcon, TrashIcon } from "@heroicons/react/24/outline";
import ConfirmBanner from "@/components/feedbacks/ConfirmBanner";
import { BackButton } from "@/components/primitives/BackButton";
import { Button } from "@/components/primitives/Button";



export default function  SellerPropertyHead({title, address_full, status, id }:{
  title:string;
  address_full:string;
  status:string;
  id:string;
}){

  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'archive' | 'delete' | null>(null);

  const router = useRouter();

  const { deleteProperty, archiveProperty, removePropertyArchive } = useDeleteProperty();

  const handleClick = (type: 'archive' | 'delete') => {
    setDialogType(type);
    setShowDialog(true);
  };

  const cantArchive = status === 'offers' || status === 'reserved' || status === 'sold';

  const handleArchiveClick = async() => {
    if (cantArchive) {
      toast.error('Cannot archive listing', {
        description: 'Listings with active offers, reserved or sold status cannot be archived.',
      })
      setShowDialog(false);
      return;
    }

    if(status === 'archived'){
      await removePropertyArchive(id);
      setShowDialog(false);
      return;
    }

    await archiveProperty(id);
    setShowDialog(false);
  }

  const handleDAeleteClick = async() => {
    if (cantArchive) {
      toast.error('Cannot delete listing', {
        description: 'Listings with active offers, reserved or sold status cannot be deleted.',
      })
      setShowDialog(false);
      return;
    }
    
    const result = await deleteProperty(id);
    if(result){
      setShowDialog(false);
      router.push('/seller-dashboard/listings');
    }
  
  }


  return(
    <>
      <header className="mb-8 flex flex-col gap-4">
        <BackButton label="Back to properties" />

        <div className=" md:flex flex-wrap items-start justify-between gap-4">

          <div className="mb-4">
            <h1 className="text-3xl font-semibold text-heading"> {title} </h1>
            <p className="mt-1 text-sm text-secondary">{address_full}</p>
          </div>

          <div className="flex gap-2 mb-4">

            <Button 
              onClick={()=>handleClick('archive')} 
              variant='outline' 
              leftIcon={<ArchiveBoxIcon className="h-4 w-4" />}
            >
              {status === 'archived' ? 'Remove Archive' : 'Archive Listing'}

            </Button>

            <Button 
              onClick={()=>handleClick('delete')} 
              variant='danger' 
              leftIcon={<TrashIcon className="h-4 w-4" />} 
            >
              Delete Listing
            </Button>
           
          </div>

        </div>
      </header>

      <ConfirmBanner
        open={showDialog}
        title={
          dialogType === 'archive' ? (status === 'archived' ? 'Remove Archive' : 'Archive Listing') : 'Delete Listing'
        }
        message={
          dialogType === 'archive'? 
          `Are you sure you want to change archive status? You can restore it later.` : 
          'Are you sure you want to delete this listing? This action cannot be undone.'
        }
        variant={dialogType === 'archive' ? 'warning' : 'danger'}
        onConfirm={dialogType === 'archive' ? handleArchiveClick : handleDAeleteClick}
        onCancel={() => setShowDialog(false)}
      />

    </>
  )
}
