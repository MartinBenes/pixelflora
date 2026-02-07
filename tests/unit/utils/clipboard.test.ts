import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard, readTextFromClipboard } from '@/utils/clipboard';

const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
const originalDocumentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');

function setGlobalValue(name: string, value: unknown): void {
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
}

afterEach(() => {
  if (originalNavigatorDescriptor) {
    Object.defineProperty(globalThis, 'navigator', originalNavigatorDescriptor);
  }
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, 'window', originalWindowDescriptor);
  }
  if (originalDocumentDescriptor) {
    Object.defineProperty(globalThis, 'document', originalDocumentDescriptor);
  }
});

describe('clipboard utilities', () => {
  it('uses navigator clipboard writeText in secure context', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setGlobalValue('navigator', { clipboard: { writeText } });
    setGlobalValue('window', { isSecureContext: true });
    setGlobalValue('document', {});

    await copyTextToClipboard('seed-json');
    expect(writeText).toHaveBeenCalledWith('seed-json');
  });

  it('falls back to document.execCommand when clipboard API is unavailable', async () => {
    const helper = {
      value: '',
      setAttribute: vi.fn(),
      style: {} as Record<string, string>,
      select: vi.fn(),
    };

    const appendChild = vi.fn();
    const removeChild = vi.fn();
    const execCommand = vi.fn().mockReturnValue(true);

    setGlobalValue('navigator', { clipboard: null });
    setGlobalValue('window', { isSecureContext: false });
    setGlobalValue('document', {
      createElement: vi.fn().mockReturnValue(helper),
      body: { appendChild, removeChild },
      execCommand,
    });

    await copyTextToClipboard('fallback');

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(appendChild).toHaveBeenCalled();
    expect(removeChild).toHaveBeenCalled();
    expect(helper.select).toHaveBeenCalled();
  });

  it('throws when fallback copy command fails', async () => {
    const helper = {
      value: '',
      setAttribute: vi.fn(),
      style: {} as Record<string, string>,
      select: vi.fn(),
    };

    setGlobalValue('navigator', { clipboard: null });
    setGlobalValue('window', { isSecureContext: false });
    setGlobalValue('document', {
      createElement: vi.fn().mockReturnValue(helper),
      body: { appendChild: vi.fn(), removeChild: vi.fn() },
      execCommand: vi.fn().mockReturnValue(false),
    });

    await expect(copyTextToClipboard('fail')).rejects.toThrow('Clipboard copy failed');
  });

  it('reads clipboard text in secure context', async () => {
    const readText = vi.fn().mockResolvedValue('serialized-seed');

    setGlobalValue('navigator', { clipboard: { readText } });
    setGlobalValue('window', { isSecureContext: true });
    setGlobalValue('document', {});

    await expect(readTextFromClipboard()).resolves.toBe('serialized-seed');
  });

  it('throws when clipboard read is unavailable', async () => {
    setGlobalValue('navigator', { clipboard: null });
    setGlobalValue('window', { isSecureContext: false });
    setGlobalValue('document', {});

    await expect(readTextFromClipboard()).rejects.toThrow(
      'Clipboard read is unavailable in this context.',
    );
  });
});
