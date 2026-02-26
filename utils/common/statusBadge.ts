export const getStatusBadge = (status:string): string => {
  switch (status) {
    case 'succeeded':
    case 'active':  
      return 'badge badge-green'
    case 'pending':
      return 'badge badge-yellow'
    case 'cancelled':
      return 'badge badge-blue'
    case 'archived':
    case 'inactive':
    case 'failed':
      return 'badge badge-red'
    default:
      return 'badge';
  }
  
};