import type { CanvasContext, Phenotype, PlantData } from '@/core/types';
import { s } from '@/core/constants';
import { PALETTES } from '@/core/palettes';
import { Random } from '@/engine/random';
import { drawPixel, drawShadedEllipse, drawShadedRhombus } from '@/engine/drawing-primitives';
import { getFlowerScale, drawFlowerCenter, drawFlowerStamens } from './index';

export function drawFlowerRadial(
  ctx: CanvasContext,
  rng: Random,
  phenotype: Phenotype,
  data: PlantData,
  windForceInt: number,
): void {
  const cx = data.topX,
    cy = data.topY;
  const isPointy = phenotype.flowerShape === 'pointy';
  const flowerScale = getFlowerScale(phenotype);

  const petalCount = rng.range(5, 8);
  const petalLen = Math.round(rng.range(s(8), s(14)) * flowerScale);
  const petalWidth = Math.round(rng.range(s(4), s(7)) * flowerScale);
  const rotOff = rng.float(0, Math.PI) + windForceInt * 0.04;

  for (let i = 0; i < petalCount; i++) {
    const angle = rotOff + (i / petalCount) * Math.PI * 2;
    const px = cx + Math.cos(angle) * (petalLen / 1.5);
    const py = cy + Math.sin(angle) * (petalLen / 1.5);
    const colorKey = i % 2 === 0 ? phenotype.flowerColor : phenotype.flowerColorSecondary;
    const pColor = PALETTES.flowers[colorKey];
    const pattern = phenotype.flowerPattern;
    const patternColor = pColor.highlight || pColor.light;
    if (isPointy)
      drawShadedRhombus(ctx, px, py, petalLen, petalWidth, angle, pColor, {
        pattern,
        patternColor,
      });
    else
      drawShadedEllipse(ctx, px, py, petalLen, petalWidth, angle, pColor, {
        pattern,
        patternColor,
      });
    drawPixel(
      ctx,
      cx + Math.cos(angle) * s(2),
      cy + Math.sin(angle) * s(2),
      pColor.shadow || pColor.dark,
    );
  }

  const centerR = Math.max(s(3), Math.round(s(3) * flowerScale));
  drawFlowerCenter(ctx, cx, cy, centerR, phenotype);
  drawFlowerStamens(ctx, rng, cx, cy, centerR, rotOff, petalCount, flowerScale, phenotype);
}
