import type {
  CanvasContext,
  ColorPalette,
  ShadedEllipseOptions,
  ShadedRhombusOptions,
} from '@/core/types';
import { LIGHT_DIR } from '@/core/constants';
import { shadeColor } from './shading';

function isPixelWithinCanvas(ctx: CanvasContext, x: number, y: number): boolean {
  const canvas = (ctx as CanvasRenderingContext2D).canvas;
  if (!canvas) {
    return true;
  }

  return x >= 0 && y >= 0 && x < canvas.width && y < canvas.height;
}

export function fillPixel(ctx: CanvasContext, x: number, y: number): void {
  const px = Math.round(x);
  const py = Math.round(y);
  if (!isPixelWithinCanvas(ctx, px, py)) {
    return;
  }

  ctx.fillRect(px, py, 1, 1);
}

export function drawPixel(ctx: CanvasContext, x: number, y: number, color: string): void {
  ctx.fillStyle = color;
  fillPixel(ctx, x, y);
}

export function drawLine(
  ctx: CanvasContext,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
): void {
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);
  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  ctx.fillStyle = color;
  while (true) {
    fillPixel(ctx, x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

export function drawCircle(
  ctx: CanvasContext,
  xc: number,
  yc: number,
  r: number,
  color: string,
): void {
  xc = Math.round(xc);
  yc = Math.round(yc);
  r = Math.floor(r);
  ctx.fillStyle = color;
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y <= r * r) fillPixel(ctx, xc + x, yc + y);
    }
  }
}

export function drawShadedCircle(
  ctx: CanvasContext,
  xc: number,
  yc: number,
  r: number,
  palette: ColorPalette,
): void {
  xc = Math.round(xc);
  yc = Math.round(yc);
  r = Math.floor(r);
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y > r * r) continue;
      const nx = x / r,
        ny = y / r;
      const dot = -(nx * LIGHT_DIR.x + ny * LIGHT_DIR.y);
      const d = (Math.abs(xc + x) + Math.abs(yc + y)) % 2 === 0;
      const color = shadeColor(dot, d, palette);
      ctx.fillStyle = color;
      fillPixel(ctx, xc + x, yc + y);
    }
  }
}

export function drawShadedEllipse(
  ctx: CanvasContext,
  xc: number,
  yc: number,
  rx: number,
  ry: number,
  angle: number,
  palette: ColorPalette,
  options: ShadedEllipseOptions = {},
): void {
  const { isSerrated = false, pattern = 'plain', patternColor = null, outline = false } = options;
  const maxR = Math.max(rx, ry) + 1;
  const cosA = Math.cos(angle),
    sinA = Math.sin(angle);
  for (let x = -maxR; x <= maxR; x++) {
    for (let y = -maxR; y <= maxR; y++) {
      const dx = x * cosA + y * sinA;
      const dy = y * cosA - x * sinA;
      const dist = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
      if (isSerrated) {
        const theta = Math.atan2(dy, dx);
        if (dist > 1.0 - 0.18 * Math.abs(Math.sin(theta * 7))) continue;
      } else {
        if (dist > 1) continue;
      }
      if (outline && dist > 0.85) {
        ctx.fillStyle = palette.shadow || palette.dark;
        fillPixel(ctx, xc + x, yc + y);
        continue;
      }
      const nx = dx / rx,
        ny = dy / ry;
      const dot = -(nx * LIGHT_DIR.x + ny * LIGHT_DIR.y);
      const d = (Math.abs(Math.round(xc + x)) + Math.abs(Math.round(yc + y))) % 2 === 0;
      let color = shadeColor(dot, d, palette);
      if (pattern === 'stripes' && Math.abs(Math.round(dx)) % 8 < 2)
        color = patternColor || palette.light;
      else if (pattern === 'dots' && Math.round(dx * dx + dy * dy) % 11 === 0)
        color = patternColor || palette.light;
      ctx.fillStyle = color;
      fillPixel(ctx, xc + x, yc + y);
    }
  }
}

export function drawShadedRhombus(
  ctx: CanvasContext,
  xc: number,
  yc: number,
  rx: number,
  ry: number,
  angle: number,
  palette: ColorPalette,
  options: ShadedRhombusOptions = {},
): void {
  const { pattern = 'plain', patternColor = null } = options;
  const maxR = Math.max(rx, ry) + 1;
  const cosA = Math.cos(angle),
    sinA = Math.sin(angle);
  for (let x = -maxR; x <= maxR; x++) {
    for (let y = -maxR; y <= maxR; y++) {
      const dx = x * cosA + y * sinA;
      const dy = y * cosA - x * sinA;
      if (Math.abs(dx / rx) + Math.abs(dy / ry) > 1) continue;
      const nx = dx / rx,
        ny = dy / ry;
      const dot = -(nx * LIGHT_DIR.x + ny * LIGHT_DIR.y);
      const d = (Math.abs(Math.round(xc + x)) + Math.abs(Math.round(yc + y))) % 2 === 0;
      let color = shadeColor(dot, d, palette);
      if (pattern === 'stripes' && Math.abs(Math.round(dx)) % 8 < 2)
        color = patternColor || palette.light;
      else if (pattern === 'dots' && Math.round(dx * dx + dy * dy) % 11 === 0)
        color = patternColor || palette.light;
      ctx.fillStyle = color;
      fillPixel(ctx, xc + x, yc + y);
    }
  }
}
