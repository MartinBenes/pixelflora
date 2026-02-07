import { CTX_WIDTH, CTX_HEIGHT } from '@/core/constants';
import { generatePlant } from '@/orchestrator/plant-generator';
import { getConfiguration, setupControls } from './controls';
import { AnimationController } from './animation';
import {
  exportBlackAndWhite,
  exportSeedCard,
  importSeedCardFromClipboard,
  importSeedCardFromText,
} from './export';
import { getRequiredElementById } from './dom';
import { generateSecureSeed } from '@/utils/random-seed';
import { serializeSeedCard } from './seed-card';

export class PlantGeneratorApp {
  private readonly canvas: HTMLCanvasElement;
  private readonly seedInput: HTMLInputElement;
  private readonly seedCardInput: HTMLTextAreaElement;
  private readonly seedDisplay: HTMLElement;
  private readonly timeDisplay: HTMLElement;
  private readonly generateButton: HTMLButtonElement;
  private readonly randomSeedButton: HTMLButtonElement;
  private readonly exportBwButton: HTMLButtonElement;
  private readonly exportSeedButton: HTMLButtonElement;
  private readonly importSeedCardButton: HTMLButtonElement;
  private readonly importSeedCardClipboardButton: HTMLButtonElement;
  private readonly animation = new AnimationController();

  constructor() {
    this.canvas = getRequiredElementById('plantCanvas', HTMLCanvasElement);
    this.seedInput = getRequiredElementById('input-seed', HTMLInputElement);
    this.seedCardInput = getRequiredElementById('input-seed-card', HTMLTextAreaElement);
    this.seedDisplay = getRequiredElementById('seed-display', HTMLElement);
    this.timeDisplay = getRequiredElementById('time-display', HTMLElement);
    this.generateButton = getRequiredElementById('btn-generate', HTMLButtonElement);
    this.randomSeedButton = getRequiredElementById('btn-random-seed', HTMLButtonElement);
    this.exportBwButton = getRequiredElementById('btn-export-bw', HTMLButtonElement);
    this.exportSeedButton = getRequiredElementById('btn-export', HTMLButtonElement);
    this.importSeedCardButton = getRequiredElementById('btn-import-seed-card', HTMLButtonElement);
    this.importSeedCardClipboardButton = getRequiredElementById(
      'btn-import-seed-card-clipboard',
      HTMLButtonElement,
    );

    this.canvas.width = CTX_WIDTH;
    this.canvas.height = CTX_HEIGHT;
  }

  init(): void {
    setupControls(() => this.update(false));

    this.generateButton.addEventListener('click', () => this.update(false));
    this.randomSeedButton.addEventListener('click', () => {
      this.seedInput.value = generateSecureSeed();
      this.update(false);
    });
    this.exportBwButton.addEventListener('click', () => {
      exportBlackAndWhite(this.canvas, () => this.update(false));
    });
    this.exportSeedButton.addEventListener('click', () => {
      exportSeedCard();
    });
    this.importSeedCardButton.addEventListener('click', () => {
      importSeedCardFromText(this.seedCardInput.value, () => this.update(false));
    });
    this.importSeedCardClipboardButton.addEventListener('click', async () => {
      await importSeedCardFromClipboard((config) => {
        this.seedCardInput.value = serializeSeedCard(config);
        this.update(false);
      });
    });

    this.update(false);
  }

  private update(isLoop: boolean): void {
    const config = getConfiguration();
    this.seedInput.value = config.seed;

    if (!config.animate && this.animation.isRunning) {
      this.animation.stop();
    } else if (config.animate && !this.animation.isRunning && !isLoop) {
      this.animation.start(() => this.update(true));
      return;
    }

    const time = generatePlant(
      this.canvas,
      config.phenotype,
      config.seed,
      this.animation.currentFrame,
      config.bgMode,
    );

    this.canvas.style.background =
      config.bgMode === 'white' ? '#fff' : config.bgMode === 'dark' ? '#1a1a1d' : 'transparent';

    this.seedDisplay.innerText = `Seed: ${config.seed}`;
    this.timeDisplay.innerText = `Render: ${time}ms | Frame: ${this.animation.currentFrame}`;
    this.seedCardInput.value = serializeSeedCard(config);
  }
}
