export function dashboardForRole(role: string) {
  switch ((role || "").toLowerCase()) {
    case "seller":
      return "/seller-dashboard";
    case "user":
      return "/user-dashboard";
    case "admin":
      return "/admin-dashboard";
    default:
      return "/";
  }
}

export function getDashboardForRole(role: string) {
  switch ((role || '').toLowerCase()) {
    case 'seller':
      return '/seller-dashboard';
    case 'user':
      return '/user-dashboard';
    case 'admin':
      return '/admin-dashboard';
    default:
      return '/user-dashboard'; 
  }
}