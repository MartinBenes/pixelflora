import type { CanvasContext, Phenotype, PlantData } from '@/core/types';
import { LIGHT_DIR, s } from '@/core/constants';
import { PALETTES } from '@/core/palettes';
import { Random } from '@/engine/random';
import { drawPixel, drawShadedEllipse, fillPixel } from '@/engine/drawing-primitives';
import { shadeColor } from '@/engine/shading';
import { getFlowerScale } from './index';

export function drawFlowerTulip(
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

  const cupH = Math.round(rng.range(s(14), s(20)) * flowerScale);
  const cupBotW = Math.round(rng.range(s(3), s(5)) * flowerScale);
  const cupTopW = Math.round(rng.range(s(8), s(11)) * flowerScale);
  const pColor = PALETTES.flowers[phenotype.flowerColor];
  const pColor2 = PALETTES.flowers[phenotype.flowerColorSecondary];
  const petalCount = 3;

  for (let row = 0; row < cupH; row++) {
    const t = row / cupH;
    const curve = t * t;
    const hw = Math.round(cupBotW + (cupTopW - cupBotW) * curve);
    const rowY = cy - row;
    const rowWindX = windOff * row * 0.15;

    for (let dx = -hw; dx <= hw; dx++) {
      const nx = hw > 0 ? dx / hw : 0;
      const dot = -(nx * LIGHT_DIR.x + (0.5 - t) * LIGHT_DIR.y);
      const d = (Math.abs(Math.round(cx + dx)) + Math.abs(rowY)) % 2 === 0;
      const petalIdx = Math.floor(((nx + 1) / 2) * petalCount);
      const pal = petalIdx % 2 === 0 ? pColor : pColor2;
      ctx.fillStyle = shadeColor(dot, d, pal);
      fillPixel(ctx, cx + dx + rowWindX, rowY);
    }

    if (t > 0.4) {
      for (let p = 1; p < petalCount; p++) {
        const seamX = cx + (p / petalCount - 0.5) * hw * 2 + rowWindX;
        drawPixel(ctx, seamX, rowY, pColor.dark);
      }
    }
  }

  const topWindX = windOff * cupH * 0.15;
  for (let i = 0; i < petalCount; i++) {
    const t = (i + 0.5) / petalCount;
    const tipX = cx + (t - 0.5) * cupTopW * 2 + topWindX;
    const tipY = cy - cupH;
    const tipR = Math.round(s(3) * flowerScale);
    const pal = i % 2 === 0 ? pColor : pColor2;
    const tilt = (t - 0.5) * 0.4;
    drawShadedEllipse(
      ctx,
      tipX,
      tipY - tipR * 0.3,
      tipR,
      Math.round(tipR * 1.3),
      -Math.PI / 2 + tilt,
      pal,
      {},
    );
  }
}
