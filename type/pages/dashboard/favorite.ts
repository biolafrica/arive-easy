export interface FavoriteBase{
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export type FavoriteForm = Omit<FavoriteBase, 'id' | 'created_at'>