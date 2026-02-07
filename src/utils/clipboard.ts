export async function copyTextToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement('textarea');
  helper.value = text;
  helper.setAttribute('readonly', '');
  helper.style.position = 'absolute';
  helper.style.left = '-9999px';
  document.body.appendChild(helper);
  helper.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(helper);

  if (!copied) {
    throw new Error('Clipboard copy failed');
  }
}

export async function readTextFromClipboard(): Promise<string> {
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.readText === 'function' &&
    window.isSecureContext
  ) {
    return navigator.clipboard.readText();
  }

  throw new Error('Clipboard read is unavailable in this context.');
}
