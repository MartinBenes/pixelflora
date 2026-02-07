import { describe, it, expect } from 'vitest';
import { createMockCanvas } from '../setup';
import { makePhenotype } from '../helpers/phenotype';
import { generatePlant } from '@/orchestrator/plant-generator';
import type { FlowerShape, FoliageColor, FlowerColor } from '@/core/types';

describe('full render', () => {
  it('renders default plant without errors', () => {
    const canvas = createMockCanvas();
    const time = generatePlant(canvas as any, makePhenotype(), 'test-seed');
    expect(parseFloat(time)).toBeGreaterThanOrEqual(0);
  });

  it('renders all flower shapes without errors', () => {
    const shapes: FlowerShape[] = ['round', 'pointy', 'tulip', 'bell', 'daisy'];
    for (const shape of shapes) {
      const canvas = createMockCanvas();
      expect(() => {
        generatePlant(canvas as any, makePhenotype({ flowerShape: shape }), `flower-${shape}`);
      }).not.toThrow();
    }
  });

  it('renders all foliage colors without errors', () => {
    const colors: FoliageColor[] = ['green', 'teal', 'autumn', 'dark'];
    for (const color of colors) {
      const canvas = createMockCanvas();
      expect(() => {
        generatePlant(canvas as any, makePhenotype({ foliageColor: color }), `foliage-${color}`);
      }).not.toThrow();
    }
  });

  it('renders all flower colors without errors', () => {
    const colors: FlowerColor[] = ['red', 'blue', 'purple', 'white', 'yellow'];
    for (const color of colors) {
      const canvas = createMockCanvas();
      expect(() => {
        generatePlant(canvas as any, makePhenotype({ flowerColor: color }), `color-${color}`);
      }).not.toThrow();
    }
  });

  it('renders with all accessories enabled', () => {
    const canvas = createMockCanvas();
    expect(() => {
      generatePlant(
        canvas as any,
        makePhenotype({
          stem: 'vine',
          stemTexture: 'hairy',
          thorns: true,
          fruit: true,
          glow: true,
          leafEdge: 'serrated',
          flowerPattern: 'stripes',
        }),
        'all-features',
      );
    }).not.toThrow();
  });

  it('renders with all sex types', () => {
    for (const sex of ['hermaphrodite', 'female', 'male'] as const) {
      const canvas = createMockCanvas();
      expect(() => {
        generatePlant(canvas as any, makePhenotype({ sex }), `sex-${sex}`);
      }).not.toThrow();
    }
  });

  it('renders with all background modes', () => {
    for (const bgMode of ['transparent', 'white', 'dark'] as const) {
      const canvas = createMockCanvas();
      expect(() => {
        generatePlant(canvas as any, makePhenotype(), 'bg-test', 0, bgMode);
      }).not.toThrow();
    }
  });

  it('renders all animation frames without errors', () => {
    for (let frame = 0; frame < 4; frame++) {
      const canvas = createMockCanvas();
      expect(() => {
        generatePlant(canvas as any, makePhenotype(), 'anim-test', frame);
      }).not.toThrow();
    }
  });
});
