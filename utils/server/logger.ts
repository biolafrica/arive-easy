import * as Sentry from '@sentry/nextjs';

const NOISE_STATUSES = new Set([400, 401, 404, 422]);

type LogLevel = 'info' | 'warning' | 'error' | 'fatal';

export interface LogContext {
  // Where the log originated
  component?: string;
  action?: string;

  // For webhook logs specifically
  applicationId?: string;
  verificationType?: string;
  sessionId?: string;
  webhookStatus?: string;

  // Any extra structured data you want attached to the Sentry event
  extra?: Record<string, unknown>;
}

function buildScope(
  scope: Sentry.Scope,
  level: LogLevel,
  context?: LogContext
) {
  scope.setLevel(level);

  if (context?.component)       scope.setTag('component', context.component);
  if (context?.action)          scope.setTag('action', context.action);
  if (context?.applicationId)   scope.setTag('application_id', context.applicationId);
  if (context?.verificationType) scope.setTag('verification_type', context.verificationType);
  if (context?.sessionId)       scope.setTag('session_id', context.sessionId);
  if (context?.webhookStatus)   scope.setTag('webhook_status', context.webhookStatus);
  if (context?.extra) {
    Object.entries(context.extra).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });
  }
}


export const logger = {
  info(message: string, context?: LogContext) {
    console.log(`[INFO] ${message}`, context ?? '');

    Sentry.addBreadcrumb({
      message,
      level: 'info',
      data: context,
    });
  },

  warn(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context ?? '');

    Sentry.withScope((scope) => {
      buildScope(scope, 'warning', context);
      Sentry.captureMessage(message, 'warning');
    });
  },

  error(error: unknown, message: string, context?: LogContext) {
    const status = (error as any)?.status ?? (error as any)?.statusCode;

    console.error(`[ERROR] ${message}`, error, context ?? '');

    if (status && NOISE_STATUSES.has(status)) return;

    Sentry.withScope((scope) => {
      const level: LogLevel = status === 403 ? 'warning' : 'error';
      buildScope(scope, level, context);
      scope.setExtra('message', message);
      Sentry.captureException(error);
    });
  },

  fatal(error: unknown, message: string, context?: LogContext) {
    console.error(`[FATAL] ${message}`, error, context ?? '');

    Sentry.withScope((scope) => {
      buildScope(scope, 'fatal', context);
      scope.setExtra('message', message);
      Sentry.captureException(error);
    });
  },
};