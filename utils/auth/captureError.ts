import * as Sentry from '@sentry/nextjs';

const NOISE_STATUSES = new Set([400, 401, 404, 422]);

export function captureError(
  error: unknown,
  context?: { component?: string; action?: string }
) {
  const status = (error as any)?.status ?? (error as any)?.statusCode;

  if (status && NOISE_STATUSES.has(status)) return;

  Sentry.withScope((scope) => {
    if (context?.component) scope.setTag('component', context.component);
    if (context?.action) scope.setTag('action', context.action);
    if (status === 403) scope.setLevel('warning');
    Sentry.captureException(error);
  });
}