import * as Sentry from '@sentry/node';

export function tracingInit() {
  Sentry.init({
    dsn: process.env.SENTRY_DNS,
    tracesSampleRate: 1.0,
  });
}

export function captureException(error, contexts) {
  Sentry.captureException(error, { contexts });
}
