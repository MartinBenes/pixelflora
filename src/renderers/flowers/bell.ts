import type { CanvasContext, Phenotype, PlantData } from '@/core/types';
import { LIGHT_DIR, s } from '@/core/constants';
import { PALETTES } from '@/core/palettes';
import { Random } from '@/engine/random';
import {
  drawLine,
  drawShadedCircle,
  drawShadedEllipse,
  fillPixel,
} from '@/engine/drawing-primitives';
import { shadeColor } from '@/engine/shading';
import { getFlowerScale } from './index';

export function drawFlowerBell(
  ctx: CanvasContext,
  rng: Random,
  phenotype: Phenotype,
  data: PlantData,
  windForceInt: number,
): void {
  const cx = data.topX,
    cy = data.topY;
  const flowerScale = getFlowerScale(phenotype);
  const windOff = windForceInt * 0.04;

  const bellH = Math.round(rng.range(s(12), s(18)) * flowerScale);
  const bellTopW = Math.round(rng.range(s(2), s(4)) * flowerScale);
  const bellBotW = Math.round(rng.range(s(8), s(12)) * flowerScale);
  const pColor = PALETTES.flowers[phenotype.flowerColor];
  const pColor2 = PALETTES.flowers[phenotype.flowerColorSecondary];

  for (let row = 0; row < bellH; row++) {
    const t = row / bellH;
    const curve = Math.sqrt(t);
    const hw = Math.round(bellTopW + (bellBotW - bellTopW) * curve);
    const rowY = cy + row;
    const rowWindX = windOff * row * 0.2;
    for (let dx = -hw; dx <= hw; dx++) {
      const nx = hw > 0 ? dx / hw : 0;
      const dot = -(nx * LIGHT_DIR.x + (t - 0.5) * LIGHT_DIR.y);
      const d = (Math.abs(Math.round(cx + dx)) + Math.abs(rowY)) % 2 === 0;
      const pal = Math.floor(row / s(2)) % 2 === 0 ? pColor : pColor2;
      ctx.fillStyle = shadeColor(dot, d, pal);
      fillPixel(ctx, cx + dx + rowWindX, rowY);
    }
  }

  const tipCount = rng.range(4, 6);
  const botWindX = windOff * bellH * 0.2;
  for (let i = 0; i < tipCount; i++) {
    const t = (i + 0.5) / tipCount;
    const tx = cx + (t - 0.5) * bellBotW * 2 + botWindX;
    const ty = cy + bellH;
    const tipR = Math.round(s(2) * flowerScale);
    drawShadedEllipse(
      ctx,
      tx,
      ty + tipR * 0.5,
      tipR,
      Math.round(tipR * 1.5),
      Math.PI / 2 + (t - 0.5) * 0.3,
      pColor,
      {},
    );
  }

  if (phenotype.sex !== 'female') {
    const stCount = rng.range(2, 4);
    for (let i = 0; i < stCount; i++) {
      const t = (i + 0.5) / stCount;
      const sx = cx + (t - 0.5) * bellBotW * 0.7 + botWindX;
      const stamenLen = rng.range(s(3), s(6));
      const sy = cy + bellH + stamenLen;
      drawLine(ctx, sx, cy + bellH, sx, sy, PALETTES.stamens.stem);
      drawShadedCircle(ctx, sx, sy, Math.max(1, s(1)), {
        highlight: '#ffcc80',
        light: PALETTES.stamens.tipLight,
        main: PALETTES.stamens.tip,
        dark: '#e65100',
      });
    }
  }
}
