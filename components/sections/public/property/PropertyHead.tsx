'use client'

import { Button } from "@/components/primitives/Button";
import { ArrowLeftIcon, BookmarkIcon, ShareIcon } from "@heroicons/react/24/outline";

export default function PropertyHead(){
  return(
    <>
      <header className="mb-8 flex flex-col gap-4">
        {/* Back */}
        <Button
          variant="text"
          size="sm"
          leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
          className="w-fit px-0 text-secondary"
          onClick={() => window.history.back()}
        >
          Back to properties
        </Button>

        {/* Title + Actions */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-heading"> Mary Keyes Residence </h1>
            <p className="mt-1 text-sm text-secondary"> 15 Mary Keyes Street, Victoria Island, Lagos, Nigeria</p>
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