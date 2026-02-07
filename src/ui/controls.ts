import { parseConfiguration } from '@/core/configuration';
import type { AppConfiguration } from '@/core/types';
import { getRequiredElementById } from './dom';

function getSelectValue(id: string): string {
  return getRequiredElementById(id, HTMLSelectElement).value;
}

function setSelectValue(id: string, value: string): void {
  getRequiredElementById(id, HTMLSelectElement).value = value;
}

function getCheckboxValue(id: string): boolean {
  return getRequiredElementById(id, HTMLInputElement).checked;
}

function setCheckboxValue(id: string, value: boolean): void {
  getRequiredElementById(id, HTMLInputElement).checked = value;
}

function getInputValue(id: string): string {
  return getRequiredElementById(id, HTMLInputElement).value;
}

function setInputValue(id: string, value: string): void {
  getRequiredElementById(id, HTMLInputElement).value = value;
}

export function getConfiguration(): AppConfiguration {
  return parseConfiguration({
    phenotype: {
      stem: getSelectValue('gene-stem'),
      stemThickness: getSelectValue('gene-stem-thickness'),
      stemTexture: getSelectValue('gene-stem-texture'),
      leaf: getSelectValue('gene-leaf'),
      leafSize: getSelectValue('gene-leaf-size'),
      leafEdge: getSelectValue('gene-leaf-edge'),
      foliageColor: getSelectValue('gene-foliage-color'),
      flowerColor: getSelectValue('gene-color'),
      flowerColorSecondary: getSelectValue('gene-color-2'),
      flowerShape: getSelectValue('gene-flower-shape'),
      flowerSize: getSelectValue('gene-flower-size'),
      flowerPattern: getSelectValue('gene-flower-pattern'),
      sex: getSelectValue('gene-sex'),
      fruitShape: getSelectValue('gene-fruit-shape'),
      thorns: getCheckboxValue('gene-thorns'),
      fruit: getCheckboxValue('gene-fruit'),
      glow: getCheckboxValue('gene-glow'),
    },
    seed: getInputValue('input-seed'),
    animate: getCheckboxValue('animate-toggle'),
    bgMode: getSelectValue('canvas-bg'),
  });
}

export function applyConfigurationToControls(config: AppConfiguration): void {
  const normalized = parseConfiguration(config);
  const { phenotype } = normalized;

  setSelectValue('gene-stem', phenotype.stem);
  setSelectValue('gene-stem-thickness', phenotype.stemThickness);
  setSelectValue('gene-stem-texture', phenotype.stemTexture);
  setSelectValue('gene-leaf', phenotype.leaf);
  setSelectValue('gene-leaf-size', phenotype.leafSize);
  setSelectValue('gene-leaf-edge', phenotype.leafEdge);
  setSelectValue('gene-foliage-color', phenotype.foliageColor);
  setSelectValue('gene-color', phenotype.flowerColor);
  setSelectValue('gene-color-2', phenotype.flowerColorSecondary);
  setSelectValue('gene-flower-shape', phenotype.flowerShape);
  setSelectValue('gene-flower-size', phenotype.flowerSize);
  setSelectValue('gene-flower-pattern', phenotype.flowerPattern);
  setSelectValue('gene-sex', phenotype.sex);
  setSelectValue('gene-fruit-shape', phenotype.fruitShape);
  setCheckboxValue('gene-thorns', phenotype.thorns);
  setCheckboxValue('gene-fruit', phenotype.fruit);
  setCheckboxValue('gene-glow', phenotype.glow);

  setInputValue('input-seed', normalized.seed);
  setCheckboxValue('animate-toggle', normalized.animate);
  setSelectValue('canvas-bg', normalized.bgMode);
}

export function setupControls(onUpdate: () => void): void {
  document.querySelectorAll('select, input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', onUpdate);
  });
  document.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener('input', onUpdate);
  });
}
