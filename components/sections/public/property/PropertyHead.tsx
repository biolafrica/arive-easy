'use client'

import SharePost from "@/components/common/Share";
import { Button } from "@/components/primitives/Button";
import { useFavorites } from "@/hooks/useSpecialized";
import { useAuthContext } from "@/providers/auth-provider";
import { PropertyHeadProps } from "@/type/pages/property";
import { ArrowLeftIcon, ArrowUpTrayIcon, BookmarkIcon as BookMarkOutline, TrashIcon} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookMarkSolid } from '@heroicons/react/24/solid';
import { toast } from "sonner";

export default function PropertyHead({title, address_full ,id, description}:PropertyHeadProps){
  const { user } = useAuthContext();

  const { isFavorited, toggleFavorite, isToggling } = useFavorites()
  const favorited = user ? isFavorited(id) : false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to save properties');
      return;
    }
    
    toggleFavorite(id);
  };

  const propertyShareDetails ={ title,id, excerpt:description}

  return(
    <>
      <header className="mb-8 flex flex-col gap-4">
        
        <Button
          variant="text"
          size="sm"
          leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          className="w-fit px-0 text-secondary"
          onClick={() => window.history.back()}
        >
          Back to properties
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-heading"> {title} </h1>
            <p className="mt-1 text-sm text-secondary">{address_full}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleFavoriteClick} disabled={isToggling} leftIcon=
              {favorited ? ( <BookMarkSolid className="h-4 w-4 text-orange-500" />) : 
                (<BookMarkOutline className="h-4 w-4 text-secondary hover:text-orange-500" />)
              }>
               Save 
            </Button>
            
            <SharePost article={propertyShareDetails}/>
          </div>

        </div>
      </header>
    </>
  )
}

export function SellerPropertyHead({title, address_full }:{
  title:string;
  address_full:string;
}){
  const handleDocumentClick = () => {
    console.log('taye')
  };


  return(
    <>
      <header className="mb-8 flex flex-col gap-4">
        <Button
          variant="text"
          size="sm"
          leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          className="w-fit px-2 text-secondary"
          onClick={() => window.history.back()}
        >
          Back to properties
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-heading"> {title} </h1>
            <p className="mt-1 text-sm text-secondary">{address_full}</p>
          </div>

          <div className="flex gap-2">

            <Button onClick={handleDocumentClick} leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}>
              Upload Document
            </Button>

            <Button onClick={handleDocumentClick} variant='outline' leftIcon={<TrashIcon className="h-4 w-4" />} className="text-red-600" >
              Delete Listing
            </Button>
          </div>

        </div>
      </header>
    </>
  )
}