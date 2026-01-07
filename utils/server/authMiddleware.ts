import { createClient } from "../supabase/server";

export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}
export async function optionalAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}