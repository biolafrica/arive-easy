"use client"

import {useArticle, useArticles, useInfiniteArticles, useProperty } from "@/hooks/useSpecialized";
import { formatDate } from "@/lib/formatter";


export default function Test(){
  const id ="858c68b3-7397-4d46-8453-d8c5acc68164";


  const {article,isLoading, error,} = useArticle(id);


  if (isLoading) return <div>Loading properties...</div>;
  if (error) return <div>Error loading properties</div>;
  console.log("property:", article)

  return(
    <div>
      <h4>Test page</h4>
    </div>
  )
}