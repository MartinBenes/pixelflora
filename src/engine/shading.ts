import type { ColorPalette } from '@/core/types';

export function blendHex(base: string, overlay: string, t: number): string {
  const b = parseInt(base.slice(1), 16);
  const o = parseInt(overlay.slice(1), 16);
  const r = Math.round(((b >> 16) & 0xff) + (((o >> 16) & 0xff) - ((b >> 16) & 0xff)) * t);
  const g = Math.round(((b >> 8) & 0xff) + (((o >> 8) & 0xff) - ((b >> 8) & 0xff)) * t);
  const bl = Math.round((b & 0xff) + ((o & 0xff) - (b & 0xff)) * t);
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`;
}

export function shadeColor(dot: number, d: boolean, palette: ColorPalette): string {
  if (dot > 0.5 && d) return blendHex(palette.main, palette.light, 0.35);
  if (dot < -0.5 && d) return blendHex(palette.main, palette.dark, 0.35);
  return palette.main;
}
