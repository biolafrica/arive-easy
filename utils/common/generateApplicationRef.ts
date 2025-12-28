export function generateApplicationRefNo(){
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const timestamp = Date.now().toString(36).toUpperCase(); 
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();

  return `PA-${year}${month}${day}-${timestamp}${random}`

} 
  