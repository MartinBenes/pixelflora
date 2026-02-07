import type { CanvasContext, Phenotype, PlantData } from '@/core/types';
import { CTX_WIDTH, CTX_HEIGHT, s } from '@/core/constants';
import { PALETTES } from '@/core/palettes';
import { Random } from '@/engine/random';
import { drawPixel, fillPixel } from '@/engine/drawing-primitives';

export function drawStem(
  ctx: CanvasContext,
  rng: Random,
  phenotype: Phenotype,
  data: PlantData,
  windForceInt: number,
): void {
  const startX = CTX_WIDTH / 2;
  const startY = CTX_HEIGHT - s(16);
  const endY = s(28);
  const isVine = phenotype.stem === 'vine';
  const isThick = phenotype.stemThickness === 'thick';
  const isHairy = phenotype.stemTexture === 'hairy';
  const palette = PALETTES.foliage[phenotype.foliageColor];

  const curveFreq = rng.float(0.03, 0.06);
  const curveAmp = isVine ? rng.range(s(6), s(10)) : rng.range(s(1), s(3));
  const phase = rng.float(0, Math.PI * 2);
  const nodeCount = rng.range(4, 7);
  const nodeInterval = (startY - endY) / nodeCount;
  const baseHalf = isThick ? s(4) : s(2);
  const tipHalf = isThick ? s(2) : s(1);
  const maxWindSway = isVine ? s(2) : s(1);

  // Pre-calculate node positions
  const nodeYs: number[] = [];
  for (let i = 1; i <= nodeCount; i++) nodeYs.push(Math.round(startY - i * nodeInterval));

  let currentX = startX,
    nextNodeIdx = 0;
  for (let y = startY; y >= endY; y--) {
    const progress = 1 - (y - endY) / (startY - endY);
    const wave = Math.sin(y * curveFreq + phase);
    const currentAmp = isVine ? curveAmp * Math.sqrt(progress) : curveAmp * progress;
    const windOffset = Math.round(windForceInt * maxWindSway * progress);
    const x = startX + wave * currentAmp + windOffset;
    const halfWidth = Math.round(baseHalf + (tipHalf - baseHalf) * progress);
    const isNearNode = nodeYs.some((ny) => Math.abs(ny - y) <= 1);
    const hw = isNearNode ? halfWidth + 1 : halfWidth;

    for (let dx = -hw; dx <= hw; dx++) {
      const color = Math.abs(dx) === hw ? palette.dark : palette.main;
      ctx.fillStyle = color;
      fillPixel(ctx, x + dx, y);
    }

    if (isHairy && rng.bool(0.12)) {
      const hs = rng.bool(0.5) ? -1 : 1;
      for (let h = 1; h <= rng.range(2, 4); h++)
        drawPixel(ctx, x + (hw + h) * hs, y - h, palette.light);
    }

    if (nextNodeIdx < nodeYs.length && y <= nodeYs[nextNodeIdx]!) {
      const prevX = startX + Math.sin((y + 1) * curveFreq + phase) * currentAmp + windOffset;
      data.stemNodes.push({ x, y, angle: Math.atan2(-1, x - prevX), halfWidth: hw });
      nextNodeIdx++;
    }
    currentX = x;
  }
  data.topX = currentX;
  data.topY = endY;
}
