import * as Sentry from '@sentry/nextjs';
import { QueryClient } from '@tanstack/react-query';

export async function clearUserSession(queryClient?: QueryClient) {

  Sentry.setUser(null);

  if (queryClient) {
    await queryClient.cancelQueries();
    queryClient.removeQueries();
  }

  const keysToKeep = ['theme', 'language']; 
  Object.keys(localStorage).forEach((key) => {
    if (!keysToKeep.includes(key)) localStorage.removeItem(key);
  });

  sessionStorage.clear();
}