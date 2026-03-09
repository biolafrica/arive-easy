"use client"

import ErrorState from "@/components/feedbacks/ErrorState"
import { Button } from "@/components/primitives/Button"



export default function Test(){
  return(
    <div className="max-w-7xl mx-auto p-10">
      <h4 className="text-2xl font-bold mb-6">Test Page</h4>
      <ErrorState message="Failed to load mortgages."  onRetry={()=>alert('yes')} />
      
    </div>
  )
}