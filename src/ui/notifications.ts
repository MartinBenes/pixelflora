type NotificationKind = 'info' | 'error';

export type AppErrorCode =
  | 'EXPORT_BW_FAILED'
  | 'EXPORT_SEED_CARD_SERIALIZATION_FAILED'
  | 'EXPORT_SEED_CARD_COPY_FAILED'
  | 'IMPORT_SEED_CARD_PARSE_FAILED'
  | 'IMPORT_SEED_CARD_CLIPBOARD_READ_FAILED';

const DEFAULT_TIMEOUT_MS = 2600;
const ROOT_ID = 'app-notifications';

function getContainer(): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const existing = document.getElementById(ROOT_ID);
  if (existing) {
    return existing;
  }

  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.className = 'app-notifications';
  document.body.appendChild(root);
  return root;
}

function showNotification(
  kind: NotificationKind,
  message: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): void {
  const container = getContainer();
  if (!container) {
    return;
  }

  const item = document.createElement('div');
  item.className = `app-notification app-notification--${kind}`;
  item.setAttribute('role', kind === 'error' ? 'alert' : 'status');
  item.textContent = message;
  container.appendChild(item);

  window.setTimeout(() => {
    item.remove();
    if (container.childElementCount === 0) {
      container.remove();
    }
  }, timeoutMs);
}

export function notifyInfo(message: string): void {
  showNotification('info', message);
}

export function notifyError(message: string): void {
  showNotification('error', message, 4200);
}

export function logAppError(
  code: AppErrorCode,
  error: unknown,
  context: Record<string, unknown> = {},
): void {
  const message = error instanceof Error ? error.message : String(error);
  const detail = { code, message, context };

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pixelflora:error', { detail }));
  }

  if (typeof globalThis.reportError === 'function') {
    globalThis.reportError(new Error(`[${code}] ${message}`));
  }
}
