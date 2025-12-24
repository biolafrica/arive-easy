const UTILITY_ROUTES = ['settings', 'support'];

export function isUtilityRoute(pathname: string) {
  return UTILITY_ROUTES.some((route) =>
    pathname.endsWith(`/${route}`)
  );
}
