import { describe, expect, it } from 'vitest';
import { createMockCanvas, MockCanvasRenderingContext2D } from '../setup';
import { makePhenotype } from '../helpers/phenotype';
import { generatePlant } from '@/orchestrator/plant-generator';

function renderSignature(seed: string, frame: number, phenotype = makePhenotype()): string {
  const canvas = createMockCanvas();
  generatePlant(canvas as any, phenotype, seed, frame);
  const ctx = canvas.getContext('2d') as unknown as MockCanvasRenderingContext2D;
  return ctx.getSignature();
}

function renderOutOfBoundsWrites(seed: string, frame: number, phenotype = makePhenotype()): number {
  const canvas = createMockCanvas();
  generatePlant(canvas as any, phenotype, seed, frame);
  const ctx = canvas.getContext('2d') as unknown as MockCanvasRenderingContext2D;
  return ctx.getOutOfBoundsWriteCount();
}

describe('determinism', () => {
  it('is deterministic across a seed/frame matrix (property-style)', () => {
    const seeds = Array.from({ length: 40 }, (_, i) => `seed-${i.toString(36)}-${i * 17}`);
    const frames = [0, 1, 2, 3];

    for (const seed of seeds) {
      for (const frame of frames) {
        const a = renderSignature(seed, frame);
        const b = renderSignature(seed, frame);
        expect(a).toBe(b);
      }
    }
  });

  it('different seeds produce different signatures for the same phenotype/frame', () => {
    const phenotype = makePhenotype({ flowerShape: 'daisy', leafEdge: 'serrated' });
    const signatureA = renderSignature('seed-alpha', 0, phenotype);
    const signatureB = renderSignature('seed-beta', 0, phenotype);

    expect(signatureA).not.toBe(signatureB);
  });

  it('different animation frames produce different signatures for the same seed', () => {
    const phenotype = makePhenotype();
    const frame0 = renderSignature('frame-variation', 0, phenotype);
    const frame1 = renderSignature('frame-variation', 1, phenotype);

    expect(frame0).not.toBe(frame1);
  });

  it('never writes outside canvas bounds across seed/feature matrix', () => {
    const seeds = Array.from({ length: 30 }, (_, i) => `bounds-${i}`);
    const phenotypes = [
      makePhenotype(),
      makePhenotype({ stem: 'vine', stemTexture: 'hairy', glow: true }),
      makePhenotype({ fruit: true, fruitShape: 'oval', leafEdge: 'serrated' }),
      makePhenotype({ flowerShape: 'bell', flowerPattern: 'stripes', flowerSize: 'large' }),
    ];

    for (const seed of seeds) {
      for (const phenotype of phenotypes) {
        for (let frame = 0; frame < 4; frame++) {
          expect(renderOutOfBoundsWrites(seed, frame, phenotype)).toBe(0);
        }
      }
    }
  });
});
