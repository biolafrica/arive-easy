export function extractUuidFromSlug(slugId: string): string | null {
  const uuidRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  
  const match = slugId.match(uuidRegex);
  return match ? match[1] : null;
}