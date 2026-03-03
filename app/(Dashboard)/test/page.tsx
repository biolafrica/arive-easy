"use client"

import { DescriptionListSkeleton } from "@/components/skeleton/DescriptionListSkeleton"

export default function Test(){
  
 
  return(
    <div className="max-w-7xl mx-auto p-10">
      <DescriptionListSkeleton rows={6}/>
      
    </div>
  )
}