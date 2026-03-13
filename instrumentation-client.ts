import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  integrations: [Sentry.replayIntegration()],

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  enableLogs: true,
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  sendDefaultPii: true,
  environment: process.env.NODE_ENV
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
