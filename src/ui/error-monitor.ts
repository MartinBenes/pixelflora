import type { AppErrorCode } from './notifications';

export interface ErrorTelemetryEvent {
  timestamp: string;
  kind: 'app' | 'window-error' | 'unhandled-rejection';
  code?: AppErrorCode;
  message: string;
  context?: Record<string, unknown>;
}

const MAX_EVENTS = 200;
const telemetryBuffer: ErrorTelemetryEvent[] = [];
let isInstalled = false;

function pushTelemetryEvent(event: ErrorTelemetryEvent): void {
  telemetryBuffer.push(event);
  if (telemetryBuffer.length > MAX_EVENTS) {
    telemetryBuffer.shift();
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function asMessage(value: unknown): string {
  if (value instanceof Error) {
    return value.message;
  }

  return String(value);
}

export function installErrorMonitor(): void {
  if (isInstalled || typeof window === 'undefined') {
    return;
  }

  isInstalled = true;
  window.__pixelfloraTelemetry = telemetryBuffer;

  window.addEventListener('pixelflora:error', (event: Event) => {
    const customEvent = event as CustomEvent<{
      code: AppErrorCode;
      message: string;
      context?: Record<string, unknown>;
    }>;

    const detail = customEvent.detail;
    const payload: ErrorTelemetryEvent = {
      timestamp: nowIso(),
      kind: 'app',
      code: detail.code,
      message: detail.message,
    };

    if (detail.context) {
      payload.context = detail.context;
    }

    pushTelemetryEvent(payload);
  });

  window.addEventListener('error', (event: ErrorEvent) => {
    pushTelemetryEvent({
      timestamp: nowIso(),
      kind: 'window-error',
      message: event.message || 'Unknown window error',
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    pushTelemetryEvent({
      timestamp: nowIso(),
      kind: 'unhandled-rejection',
      message: asMessage(event.reason),
    });
  });
}

declare global {
  interface Window {
    __pixelfloraTelemetry?: ErrorTelemetryEvent[];
  }
}
