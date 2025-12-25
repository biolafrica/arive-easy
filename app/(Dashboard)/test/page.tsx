'use client'

import { useInfiniteFavoriteProperties } from "@/hooks/useSpecialized"
import { useAuthContext } from "@/providers/auth-provider";

export default function Test(){
  const {items:properties, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error, refresh } = useInfiniteFavoriteProperties(
    {include: ['properties']}
  )
  const { user } = useAuthContext();

  console.log("my favorites", properties)
  console.log("user details", user)
 

  return(
    <div>
      <h4>Test page</h4>
    </div>
  )
}