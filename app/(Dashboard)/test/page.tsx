"use client"

import {useProperty } from "@/hooks/useSpecialized";

export default function Test(){
  const id ="0ca3e480-6a3e-4c47-bed0-637386b5f64c";
  
  const {
    property,
    isLoading,
    error,
  } = useProperty(id);

  if (isLoading) return <div>Loading properties...</div>;
  if (error) return <div>Error loading properties</div>;
  console.log("property:", property)

  return(
    <div>
      <h4>Test page</h4>
    </div>
  )
}