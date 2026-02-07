import type { CanvasContext, Phenotype, PlantData } from '@/core/types';
import { s } from '@/core/constants';
import { PALETTES } from '@/core/palettes';
import { Random } from '@/engine/random';
import { drawLine, drawShadedEllipse, fillPixel } from '@/engine/drawing-primitives';

export function drawLeaves(
  ctx: CanvasContext,
  rng: Random,
  phenotype: Phenotype,
  data: PlantData,
  windForceInt: number,
): void {
  const isWide = phenotype.leaf === 'wide';
  const isSerrated = phenotype.leafEdge === 'serrated';
  const palette = PALETTES.foliage[phenotype.foliageColor];

  let minLen: number, maxLen: number;
  if (phenotype.leafSize === 'small') {
    minLen = s(8);
    maxLen = s(12);
  } else if (phenotype.leafSize === 'large') {
    minLen = s(14);
    maxLen = s(20);
  } else {
    minLen = s(10);
    maxLen = s(15);
  }

  const nodeCount = data.stemNodes.length;
  if (nodeCount < 2) return;

  const leafCount = nodeCount >= 6 ? 4 : 3;

  const usable = data.stemNodes
    .map((node, i) => ({ node, i }))
    .filter(({ i }) => {
      const hr = i / nodeCount;
      return hr >= 0.1 && hr <= 0.55;
    });
  if (usable.length === 0) return;

  const step = Math.max(1, Math.floor(usable.length / leafCount));
  const picked: typeof usable = [];
  for (let k = 0; k < leafCount && k * step < usable.length; k++) {
    picked.push(usable[k * step]!);
  }

  picked.forEach(({ node }, idx) => {
    const side = idx % 2 === 0 ? 1 : -1;
    const droop = rng.float(0.08, 0.35);
    const jitter = rng.float(-0.1, 0.1);
    const windRot = windForceInt * 0.04;
    const leafAngle = side > 0 ? droop + jitter + windRot : Math.PI - droop + jitter + windRot;

    const len = rng.range(minLen, maxLen);
    const width = isWide ? rng.range(s(5), s(8)) : rng.range(s(3), s(5));

    // Petiole (leaf stalk)
    const petLen = Math.round(len * 0.2);
    const petEndX = node.x + Math.cos(leafAngle) * petLen;
    const petEndY = node.y + Math.sin(leafAngle) * petLen;
    drawLine(ctx, node.x, node.y, petEndX, petEndY, palette.dark);

    // Leaf blade (shaded)
    const bladeCx = petEndX + Math.cos(leafAngle) * (len / 2);
    const bladeCy = petEndY + Math.sin(leafAngle) * (len / 2);
    drawShadedEllipse(ctx, bladeCx, bladeCy, len / 2, width / 2, leafAngle, palette, {
      isSerrated,
    });

    // Central vein (midrib)
    const tipX = petEndX + Math.cos(leafAngle) * len;
    const tipY = petEndY + Math.sin(leafAngle) * len;
    drawLine(ctx, petEndX, petEndY, tipX, tipY, palette.dark);

    // Side veins
    const veinCount = Math.max(2, Math.floor(len / s(5)));
    for (let v = 1; v <= veinCount; v++) {
      const t = v / (veinCount + 1);
      const vbx = petEndX + Math.cos(leafAngle) * (len * t);
      const vby = petEndY + Math.sin(leafAngle) * (len * t);
      const vLen = (width / 2) * (1 - Math.abs(t - 0.5) * 1.5) * 0.7;
      for (const vs of [-1, 1]) {
        const vAngle = leafAngle + vs * (Math.PI / 3.5);
        drawLine(
          ctx,
          vbx,
          vby,
          vbx + Math.cos(vAngle) * vLen,
          vby + Math.sin(vAngle) * vLen,
          palette.shadow || palette.dark,
        );
      }
    }
  });
}

export function drawTendrils(
  ctx: CanvasContext,
  rng: Random,
  phenotype: Phenotype,
  data: PlantData,
): void {
  const palette = PALETTES.foliage[phenotype.foliageColor];
  data.stemNodes.forEach((node, index) => {
    if (rng.bool(0.65)) {
      const side = index % 2 === 0 ? 1 : -1;
      let tx = node.x,
        ty = node.y;
      const length = rng.range(s(5), s(10));
      let angle = side === 1 ? 0 : Math.PI;
      for (let i = 0; i < length; i++) {
        tx += Math.cos(angle);
        ty += Math.sin(angle);
        angle += side * 0.6;
        ctx.fillStyle = i / length < 0.3 ? palette.main : palette.light;
        fillPixel(ctx, tx, ty);
      }
      // Coil at tip
      for (let i = 0; i < s(3); i++) {
        tx += Math.cos(angle) * 0.8;
        ty += Math.sin(angle) * 0.8;
        angle += side * 1.2;
        ctx.fillStyle = palette.light;
        fillPixel(ctx, tx, ty);
      }
    }
  });
}
