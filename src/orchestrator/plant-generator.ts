import type { CanvasContext, BgMode, CanvasLike, Phenotype, PlantData } from '@/core/types';
import { CTX_WIDTH, CTX_HEIGHT } from '@/core/constants';
import { Random } from '@/engine/random';
import { drawPot } from '@/renderers/pot';
import { drawStem } from '@/renderers/stem';
import { drawLeaves, drawTendrils } from '@/renderers/leaves';
import { drawThorns, drawFruits, drawGlow } from '@/renderers/accessories';
import { drawFlower } from '@/renderers/flowers/index';
import { getRequiredContext2D } from '@/utils/canvas';

const WIND_PATTERN = [0, 1, 0, -1] as const;

function applyCanvasBackground(ctx: CanvasContext, bgMode: BgMode): void {
  if (bgMode === 'transparent') {
    return;
  }

  ctx.fillStyle = bgMode === 'white' ? '#ffffff' : '#1a1a1d';
  ctx.fillRect(0, 0, CTX_WIDTH, CTX_HEIGHT);
}

function getWindForce(frame: number): number {
  const normalizedFrame =
    ((frame % WIND_PATTERN.length) + WIND_PATTERN.length) % WIND_PATTERN.length;
  return WIND_PATTERN[normalizedFrame as 0 | 1 | 2 | 3];
}

export function generatePlant(
  canvas: CanvasLike,
  phenotype: Phenotype,
  seedStr: string,
  frame = 0,
  bgMode: BgMode = 'transparent',
): string {
  const startTime = performance.now();
  const ctx = getRequiredContext2D(canvas);
  ctx.clearRect(0, 0, CTX_WIDTH, CTX_HEIGHT);
  applyCanvasBackground(ctx, bgMode);

  const rngFor = (component: string): Random => new Random(`${seedStr}_${component}`);
  const plantData: PlantData = { stemNodes: [], topX: 0, topY: 0 };
  const windForceInt = getWindForce(frame);

  drawStem(ctx, rngFor('stem'), phenotype, plantData, windForceInt);
  drawPot(ctx, rngFor('pot'));
  if (phenotype.stem === 'vine') drawTendrils(ctx, rngFor('tendrils'), phenotype, plantData);
  drawLeaves(ctx, rngFor('leaves'), phenotype, plantData, windForceInt);
  if (phenotype.thorns) drawThorns(ctx, rngFor('thorns'), plantData);
  if (phenotype.fruit) drawFruits(ctx, rngFor('fruit'), phenotype, plantData);
  drawFlower(ctx, rngFor('flower'), phenotype, plantData, windForceInt);
  if (phenotype.glow) drawGlow(ctx, rngFor('glow'), plantData);

  return (performance.now() - startTime).toFixed(2);
}
