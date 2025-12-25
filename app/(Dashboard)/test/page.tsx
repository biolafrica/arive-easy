'use client'

import { useFavorites } from "@/hooks/useSpecialized"
import { useAuthContext } from "@/providers/auth-provider";

export default function Test(){
  const {favorites} = useFavorites()
  const { user } = useAuthContext();

  console.log("my favorites", favorites)
  console.log("user details", user)
 

  return(
    <div>
      <h4>Test page</h4>
    </div>
  )
}