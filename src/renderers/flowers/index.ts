import type { CanvasContext, ColorPalette, Phenotype, PlantData } from '@/core/types';
import { s } from '@/core/constants';
import { PALETTES } from '@/core/palettes';
import { Random } from '@/engine/random';
import { drawPixel, drawLine, drawShadedCircle } from '@/engine/drawing-primitives';
import { drawFlowerRadial } from './radial';
import { drawFlowerTulip } from './tulip';
import { drawFlowerBell } from './bell';
import { drawFlowerDaisy } from './daisy';

export function drawFlower(
  ctx: CanvasContext,
  rng: Random,
  phenotype: Phenotype,
  data: PlantData,
  windForceInt: number,
): void {
  const shape = phenotype.flowerShape;
  if (shape === 'tulip') return drawFlowerTulip(ctx, rng, phenotype, data, windForceInt);
  if (shape === 'bell') return drawFlowerBell(ctx, rng, phenotype, data, windForceInt);
  if (shape === 'daisy') return drawFlowerDaisy(ctx, rng, phenotype, data, windForceInt);
  return drawFlowerRadial(ctx, rng, phenotype, data, windForceInt);
}

export function getFlowerScale(phenotype: Phenotype): number {
  if (phenotype.flowerSize === 'small') return 0.5;
  if (phenotype.flowerSize === 'large') return 1.0;
  return 0.7;
}

export function getFlowerCenterPalette(flowerColor: Phenotype['flowerColor']): ColorPalette {
  if (flowerColor === 'yellow') {
    return { highlight: '#ffcc80', light: '#fb8c00', main: '#ef6c00', dark: '#e65100' };
  }

  return { highlight: '#fffde7', light: '#fff9c4', main: '#fdd835', dark: '#f9a825' };
}

export function drawFlowerCenter(
  ctx: CanvasContext,
  cx: number,
  cy: number,
  centerR: number,
  phenotype: Phenotype,
): void {
  if (phenotype.sex !== 'male') {
    const cp = getFlowerCenterPalette(phenotype.flowerColor);
    drawShadedCircle(ctx, cx, cy, centerR, cp);
    drawPixel(ctx, cx, cy - 1, cp.dark);
    drawPixel(ctx, cx, cy, '#5d4037');
  } else {
    drawShadedCircle(ctx, cx, cy, Math.max(s(2), centerR - 2), {
      highlight: '#a1887f',
      light: '#8d6e63',
      main: '#6d4c41',
      dark: '#4e342e',
    });
  }
}

export function drawFlowerStamens(
  ctx: CanvasContext,
  rng: Random,
  cx: number,
  cy: number,
  centerR: number,
  rotOff: number,
  petalCount: number,
  flowerScale: number,
  phenotype: Phenotype,
): void {
  if (phenotype.sex === 'female') return;
  const stamenCount = rng.range(4, 7);
  for (let i = 0; i < stamenCount; i++) {
    const angle = (i / stamenCount) * Math.PI * 2 + rotOff + Math.PI / petalCount;
    const len = Math.round(rng.range(s(5), s(9)) * flowerScale);
    const sx = cx + Math.cos(angle) * len,
      sy = cy + Math.sin(angle) * len;
    drawLine(
      ctx,
      cx + Math.cos(angle) * (centerR + 1),
      cy + Math.sin(angle) * (centerR + 1),
      sx,
      sy,
      PALETTES.stamens.stem,
    );
    drawShadedCircle(ctx, sx, sy, Math.max(1, s(1)), {
      highlight: '#ffcc80',
      light: PALETTES.stamens.tipLight,
      main: PALETTES.stamens.tip,
      dark: '#e65100',
    });
  }
}
