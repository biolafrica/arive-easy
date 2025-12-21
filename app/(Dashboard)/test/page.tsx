"use client"

import {useArticles, useInfiniteArticles, useProperty } from "@/hooks/useSpecialized";
import { formatDate } from "@/lib/formatter";


export default function Test(){
  const id ="2025-12-21T20:43:51.599779";
  const {articles, isLoading, error } = useArticles({
    include: ['users'],
    sortBy: 'created_at',
    sortOrder: 'desc',
    limit:3
  
  });

  const date = formatDate(id)
 

  if (isLoading) return <div>Loading properties...</div>;
  if (error) return <div>Error loading properties</div>;
  console.log("property:", date)

  return(
    <div>
      <h4>Test page</h4>
    </div>
  )
}