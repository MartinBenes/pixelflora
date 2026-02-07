import type { CanvasContext } from '@/core/types';
import { CTX_WIDTH, CTX_HEIGHT, s } from '@/core/constants';
import { PALETTES } from '@/core/palettes';
import { Random } from '@/engine/random';
import { fillPixel } from '@/engine/drawing-primitives';

export function drawPot(ctx: CanvasContext, rng: Random): void {
  void rng; // rng passed for API consistency, unused currently
  const cx = CTX_WIDTH / 2;
  const potHeight = s(12);
  const yBottom = CTX_HEIGHT - s(3);
  const yTop = yBottom - potHeight;
  const halfTop = s(18) / 2;
  const halfBot = s(12) / 2;
  const rimH = s(2);
  const rimW = halfTop + s(1);

  // Main body
  ctx.fillStyle = PALETTES.pot.main;
  for (let i = 0; i <= potHeight; i++) {
    const t = i / potHeight;
    const hw = halfTop - t * (halfTop - halfBot);
    for (let dx = -hw; dx < hw; dx++) {
      fillPixel(ctx, cx + dx, yTop + i);
    }
  }

  // Soil visible inside pot (thin strip just below rim)
  ctx.fillStyle = PALETTES.pot.soil;
  for (let row = 0; row < s(1); row++) {
    const soilHw = halfTop - s(1);
    for (let dx = -soilHw; dx < soilHw; dx++) {
      fillPixel(ctx, cx + dx, yTop + row);
    }
  }

  // Rim (on top of everything)
  for (let ry = 0; ry < rimH; ry++) {
    ctx.fillStyle = ry === 0 ? PALETTES.pot.rim : PALETTES.pot.main;
    for (let dx = -rimW; dx < rimW; dx++) {
      fillPixel(ctx, cx + dx, yTop - ry);
    }
  }
}
