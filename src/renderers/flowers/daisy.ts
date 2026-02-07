import type { CanvasContext, Phenotype, PlantData } from '@/core/types';
import { s } from '@/core/constants';
import { PALETTES } from '@/core/palettes';
import { Random } from '@/engine/random';
import { drawPixel, drawShadedCircle, drawShadedEllipse } from '@/engine/drawing-primitives';
import { getFlowerCenterPalette, getFlowerScale } from './index';

export function drawFlowerDaisy(
  ctx: CanvasContext,
  rng: Random,
  phenotype: Phenotype,
  data: PlantData,
  windForceInt: number,
): void {
  const cx = data.topX,
    cy = data.topY;
  const flowerScale = getFlowerScale(phenotype);

  const petalCount = rng.range(12, 18);
  const petalLen = Math.round(rng.range(s(8), s(12)) * flowerScale);
  const petalWidth = Math.round(rng.range(s(2), s(3)) * flowerScale);
  const rotOff = rng.float(0, Math.PI) + windForceInt * 0.04;
  const pattern = phenotype.flowerPattern;

  for (let i = 0; i < petalCount; i++) {
    const angle = rotOff + (i / petalCount) * Math.PI * 2;
    const px = cx + Math.cos(angle) * (petalLen * 0.6);
    const py = cy + Math.sin(angle) * (petalLen * 0.6);
    const colorKey = i % 2 === 0 ? phenotype.flowerColor : phenotype.flowerColorSecondary;
    const pColor = PALETTES.flowers[colorKey];
    const patternColor = pColor.highlight || pColor.light;
    drawShadedEllipse(ctx, px, py, petalLen / 2, petalWidth, angle, pColor, {
      pattern,
      patternColor,
    });
  }

  const centerR = Math.max(s(4), Math.round(s(5) * flowerScale));
  const cp = getFlowerCenterPalette(phenotype.flowerColor);
  drawShadedCircle(ctx, cx, cy, centerR, cp);

  for (let i = 0; i < centerR * 3; i++) {
    const angle = rng.float(0, Math.PI * 2);
    const dist = rng.float(1, centerR - 1);
    const dx = Math.round(cx + Math.cos(angle) * dist);
    const dy = Math.round(cy + Math.sin(angle) * dist);
    drawPixel(ctx, dx, dy, rng.bool(0.5) ? cp.dark : '#5d4037');
  }
}
