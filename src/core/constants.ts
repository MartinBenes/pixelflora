import type { LightDirection } from './types';

export const LIGHT_DIR: LightDirection = { x: -0.6, y: -0.8 };

export const DETAIL_FACTOR = 3;

export const s = (value: number): number => Math.max(1, Math.round(value * DETAIL_FACTOR));

export const CTX_WIDTH = s(64); // 192
export const CTX_HEIGHT = s(96); // 288
