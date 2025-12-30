"use client"

import { useApplications } from "@/hooks/useSpecialized/useApplications";

export default function Test(){
 const {applications, pagination} = useApplications({
  include:['properties'],
 })

  console.log("year", applications)
  console.log("pagination", pagination)
 
  return(
    <div>
      <h4>Test page</h4>
    </div>
  )
}