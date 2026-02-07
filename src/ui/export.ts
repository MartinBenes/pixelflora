import { copyTextToClipboard, readTextFromClipboard } from '@/utils/clipboard';
import { getRequiredContext2D } from '@/utils/canvas';
import type { AppConfiguration } from '@/core/types';
import { applyConfigurationToControls, getConfiguration } from './controls';
import { logAppError, notifyError, notifyInfo } from './notifications';
import { deserializeSeedCard, serializeSeedCard } from './seed-card';

export function exportBlackAndWhite(canvas: HTMLCanvasElement, onReRender: () => void): void {
  try {
    const ctx = getRequiredContext2D(canvas);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const a = (data[i + 3] ?? 0) / 255;
      const r = (data[i] ?? 0) * a + 255 * (1 - a);
      const g = (data[i + 1] ?? 0) * a + 255 * (1 - a);
      const b = (data[i + 2] ?? 0) * a + 255 * (1 - a);
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      data[i] = data[i + 1] = data[i + 2] = gray;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    const link = document.createElement('a');
    link.download = `plant-bw-${getConfiguration().seed}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    onReRender();
    notifyInfo('Black-and-white PNG export completed.');
  } catch (error) {
    logAppError('EXPORT_BW_FAILED', error);
    notifyError('PNG export failed. Please try again.');
  }
}

export async function exportSeedCard(): Promise<void> {
  let payload = '';
  const config = getConfiguration();

  try {
    payload = serializeSeedCard(config);
  } catch (error) {
    logAppError('EXPORT_SEED_CARD_SERIALIZATION_FAILED', error, { config });
    notifyError('Failed to serialize the seed card.');
    return;
  }

  try {
    await copyTextToClipboard(payload);
    notifyInfo('Seed card JSON copied to clipboard.');
  } catch (error) {
    logAppError('EXPORT_SEED_CARD_COPY_FAILED', error, { seed: config.seed });
    notifyError('Copying seed card failed. Open the page over HTTPS.');
  }
}

export function importSeedCardFromText(
  serialized: string,
  onImported: (config: AppConfiguration) => void,
): boolean {
  try {
    const config = deserializeSeedCard(serialized);
    applyConfigurationToControls(config);
    onImported(config);
    notifyInfo('Seed card loaded.');
    return true;
  } catch (error) {
    logAppError('IMPORT_SEED_CARD_PARSE_FAILED', error, {
      payloadPreview: serialized.slice(0, 120),
    });
    notifyError('Invalid seed card. Check JSON format.');
    return false;
  }
}

export async function importSeedCardFromClipboard(
  onImported: (config: AppConfiguration) => void,
): Promise<boolean> {
  let clipboardText = '';
  try {
    clipboardText = await readTextFromClipboard();
  } catch (error) {
    logAppError('IMPORT_SEED_CARD_CLIPBOARD_READ_FAILED', error);
    notifyError('Cannot read clipboard. Open the page over HTTPS.');
    return false;
  }

  return importSeedCardFromText(clipboardText, onImported);
}
