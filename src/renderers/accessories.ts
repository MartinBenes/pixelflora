import type { CanvasContext, Phenotype, PlantData } from '@/core/types';
import { CTX_WIDTH, CTX_HEIGHT, s } from '@/core/constants';
import { PALETTES } from '@/core/palettes';
import { Random } from '@/engine/random';
import {
  drawPixel,
  drawLine,
  drawShadedCircle,
  drawShadedEllipse,
  fillPixel,
} from '@/engine/drawing-primitives';

export function drawThorns(ctx: CanvasContext, rng: Random, data: PlantData): void {
  data.stemNodes.forEach((node, index) => {
    const side = index % 2 === 0 ? 1 : -1;
    const angle = node.angle + (side * Math.PI) / 2;
    const len = rng.range(s(3), s(5));
    const tipX = node.x + Math.cos(angle) * len;
    const tipY = node.y + Math.sin(angle) * len;
    drawLine(ctx, node.x, node.y, tipX, tipY, PALETTES.thorns.main);
    drawLine(
      ctx,
      node.x,
      node.y + 1,
      node.x + Math.cos(angle) * (len * 0.6),
      node.y + 1 + Math.sin(angle) * (len * 0.6),
      PALETTES.thorns.dark,
    );
    drawPixel(
      ctx,
      node.x + Math.cos(angle) * 2,
      node.y + Math.sin(angle) * 2 - 1,
      PALETTES.thorns.highlight,
    );
  });
}

export function drawFruits(
  ctx: CanvasContext,
  rng: Random,
  phenotype: Phenotype,
  data: PlantData,
): void {
  const fruitPalette = rng.pick(PALETTES.fruits);
  const stemPalette = PALETTES.foliage[phenotype.foliageColor];
  const isOval = phenotype.fruitShape === 'oval';

  data.stemNodes.forEach((node) => {
    if (rng.bool(0.55)) {
      const r = rng.range(s(2), s(4));
      const offsetX = rng.pick([-s(5), s(5)]);
      const offsetY = rng.range(s(1), s(5));
      drawLine(
        ctx,
        node.x,
        node.y,
        node.x + offsetX * 0.6,
        node.y + offsetY * 0.7,
        stemPalette.dark,
      );
      const fx = node.x + offsetX,
        fy = node.y + offsetY + s(1);
      if (isOval) drawShadedEllipse(ctx, fx, fy, r, Math.round(r * 1.4), 0, fruitPalette);
      else drawShadedCircle(ctx, fx, fy, r, fruitPalette);
      drawPixel(ctx, fx - 1, fy - 1, fruitPalette.highlight);
    }
  });
}

export function drawGlow(ctx: CanvasContext, rng: Random, data: PlantData): void {
  const colors = PALETTES.glow;
  for (let i = 0; i < rng.range(12, 20); i++) {
    const angle = rng.float(0, Math.PI * 2);
    const dist = rng.range(s(6), s(16));
    const x = Math.round(data.topX + Math.cos(angle) * dist);
    const y = Math.round(data.topY + Math.sin(angle) * dist);
    if (x > 0 && x < CTX_WIDTH && y > 0 && y < CTX_HEIGHT) {
      ctx.fillStyle = rng.pick([colors.bright, colors.mid, colors.dim]);
      fillPixel(ctx, x, y);
      if (rng.bool(0.3)) {
        fillPixel(ctx, x + 1, y);
        fillPixel(ctx, x, y + 1);
      }
    }
  }
  data.stemNodes.forEach((node) => {
    if (rng.bool(0.45)) {
      const gx = Math.round(node.x + rng.pick([-1, 1]) * rng.range(s(3), s(7)));
      const gy = Math.round(node.y + rng.range(-s(3), s(3)));
      if (gx > 0 && gx < CTX_WIDTH && gy > 0 && gy < CTX_HEIGHT) {
        ctx.fillStyle = rng.pick([colors.bright, colors.mid, colors.dim]);
        fillPixel(ctx, gx, gy);
      }
    }
  });
}
