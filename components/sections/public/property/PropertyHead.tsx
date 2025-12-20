'use client'

import { Button } from "@/components/primitives/Button";
import { PropertyHeadProps } from "@/type/pages/property";
import { ArrowLeftIcon, BookmarkIcon, ShareIcon } from "@heroicons/react/24/outline";

export default function PropertyHead({title,address_full}:PropertyHeadProps){
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
            <Button variant="outline" size="sm" leftIcon={<BookmarkIcon className="h-4 w-4" />}> Save </Button>
            <Button variant="outline" size="sm" leftIcon={<ShareIcon className="h-4 w-4" />}> Share </Button>
          </div>

        </div>
      </header>
    </>
  )
}